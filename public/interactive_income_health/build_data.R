# =====================================================================
# build_data.R  (v3 — unified SHARE + ELSA + HRS)
# Builds per-entity income x health bins for the interactive chart.
#
# Entities:  28 SHARE countries + England (ELSA) + United States (HRS)
# Measures:  srh (1-5, higher=better) — comparable across ALL surveys
#            casp (12-48) and eurod (0-12) — SHARE only (different scales
#            in ELSA/HRS), so comparators carry NA for these.
# Axes:      income rank (deciles/quintiles, within entity x wave)  OR
#            absolute PPP-adjusted income (int'l $, US price level = 1).
# Each bin carries RAW and AGE-STANDARDISED means (direct standardisation
# over 5-year age bands to a common reference distribution).
# Waves:     per real wave (SHARE only) + "c2015" (each entity's wave
#            nearest 2015, with its source year) + "all" (pooled).
# Output:    chart_data.json
# =====================================================================

suppressMessages({ library(dplyr); library(haven); library(jsonlite) })
setwd("/Users/alianver/Desktop/SHARE/interactive_income_health")

EURUSD_2017 <- 1.13
GBPUSD_2017 <- 1.29

# ---------------------------------------------------------------------
# 1. World Bank price levels (GDP pc market $ / GDP pc PPP $), US = 1
# ---------------------------------------------------------------------
wb_val <- function(path){ x<-fromJSON(path,simplifyVector=TRUE); df<-x[[2]]
  data.frame(iso3=df$countryiso3code, value=suppressWarnings(as.numeric(df$value)), stringsAsFactors=FALSE) }
mkt<-wb_val("wb_gdp_mkt_2017.json"); names(mkt)[2]<-"gdp_mkt"
ppp<-wb_val("wb_gdp_ppp_2017.json"); names(ppp)[2]<-"gdp_ppp"
wb<-merge(mkt,ppp,by="iso3"); wb$price_level<-wb$gdp_mkt/wb$gdp_ppp

iso_map <- c(Austria="AUT",Belgium="BEL",Bulgaria="BGR",Croatia="HRV",Cyprus="CYP",
  `Czech Republic`="CZE",Denmark="DNK",Estonia="EST",Finland="FIN",France="FRA",
  Germany="DEU",Greece="GRC",Hungary="HUN",Ireland="IRL",Italy="ITA",Latvia="LVA",
  Lithuania="LTU",Luxembourg="LUX",Malta="MLT",Netherlands="NLD",Poland="POL",
  Portugal="PRT",Romania="ROU",Slovakia="SVK",Slovenia="SVN",Spain="ESP",Sweden="SWE",Switzerland="CHE")
pl_fallback <- c(AUT=0.95,BEL=0.96,BGR=0.42,HRV=0.55,CYP=0.78,CZE=0.58,DNK=1.20,EST=0.65,
  FIN=1.09,FRA=0.98,DEU=0.94,GRC=0.72,HUN=0.51,IRL=1.05,ITA=0.85,LVA=0.62,LTU=0.56,
  LUX=1.10,MLT=0.72,NLD=0.98,POL=0.50,PRT=0.70,ROU=0.44,SVK=0.58,SVN=0.71,ESP=0.80,SWE=1.13,CHE=1.35)
pl_of <- function(iso){ v<-wb$price_level[match(iso,wb$iso3)]; ifelse(is.na(v)|v<=0, pl_fallback[iso], v) }
pl_ctry <- setNames(pl_of(unname(iso_map)), names(iso_map))
PL_US <- 1.000
PL_UK <- pl_of("GBR")   # 0.881

# ---------------------------------------------------------------------
# 2. Region + wave-year maps
# ---------------------------------------------------------------------
region <- c(Denmark="North",Sweden="North",Finland="North",
  Austria="West",Belgium="West",France="West",Germany="West",Luxembourg="West",
  Netherlands="West",Switzerland="West",Ireland="West",
  Cyprus="South",Greece="South",Italy="South",Malta="South",Portugal="South",Spain="South",
  Bulgaria="East",Croatia="East",`Czech Republic`="East",Estonia="East",Hungary="East",
  Latvia="East",Lithuania="East",Poland="East",Romania="East",Slovakia="East",Slovenia="East")
SHARE_YEARS <- c(`1`=2004,`2`=2006,`4`=2011,`5`=2013,`6`=2015,`8`=2019,`9`=2021)
ELSA_YEARS  <- c(`1`=2002,`2`=2004,`4`=2008,`5`=2010,`6`=2012,`7`=2014,`8`=2016,`9`=2018,`10`=2021)
HRS_YEARS   <- c(`7`=2004,`8`=2006,`9`=2008,`10`=2010,`11`=2012,`12`=2014,`13`=2016,`14`=2018,`15`=2020,`16`=2022)

bandit <- function(age) pmin(90, pmax(50, floor(age/5)*5))   # 5-yr bands, cap 50..90

# ---------------------------------------------------------------------
# 3. Harmonise each survey to a common person frame
#    cols: entity, survey, region, is_comp, wave(str), year, srh, casp,
#          eurod, ppp, eur (native income), band
# ---------------------------------------------------------------------
# ---- SHARE ----
sh <- readRDS("../Data/share_analysis.rds")
sh$entity <- as.character(haven::as_factor(sh$country))
sh <- sh %>%
  filter(entity != "Israel", !is.na(thinc), thinc > 0, !is.na(age), age >= 50) %>%
  mutate(
    survey="SHARE", region=region[entity], is_comp=FALSE,
    wave=as.character(wave), year=SHARE_YEARS[wave],
    srh   = ifelse(sphus %in% 1:5, 6 - sphus, NA_real_),
    casp  = ifelse(casp  >= 12 & casp  <= 48, casp,  NA_real_),
    eurod = ifelse(eurod >= 0  & eurod <= 12, eurod, NA_real_),
    pl    = pl_ctry[entity],
    ppp   = ifelse(thinc > 0, thinc * EURUSD_2017 / pl, NA_real_),
    eur   = thinc, band = bandit(age)
  ) %>% select(entity,survey,region,is_comp,wave,year,srh,casp,eurod,ppp,eur,band)

# ---- ELSA (England) ----
el <- readRDS("../Other Datasets/SHARE Global comparision/ELSA comparison/processed/brady_model_elsa.rds") %>%
  mutate(age = as.numeric(as.character(age5))) %>%
  filter(!is.na(hitot), hitot > 0, !is.na(age), age >= 50) %>%
  transmute(
    entity="England", survey="ELSA", region="Comparator", is_comp=TRUE,
    wave=as.character(wave), year=ELSA_YEARS[as.character(wave)],
    srh=srh, casp=NA_real_, eurod=NA_real_,
    ppp = hitot * GBPUSD_2017 / PL_UK, eur = hitot, band = bandit(age)
  )

# ---- HRS (United States) ----
hr <- readRDS("../Other Datasets/SHARE Global comparision/HRS comparison/processed/brady_model_hrs.rds") %>%
  mutate(age = as.numeric(as.character(age5))) %>%
  filter(!is.na(hitot), hitot > 0, !is.na(age), age >= 50) %>%
  transmute(
    entity="United States", survey="HRS", region="Comparator", is_comp=TRUE,
    wave=as.character(wave), year=HRS_YEARS[as.character(wave)],
    srh=srh, casp=NA_real_, eurod=NA_real_,
    ppp = hitot / PL_US, eur = hitot, band = bandit(age)
  )

D <- bind_rows(sh, el, hr) %>% filter(!is.na(year))
cat("Person-rows:", nrow(D), " | SHARE", nrow(sh), "ELSA", nrow(el), "HRS", nrow(hr), "\n")

# ---------------------------------------------------------------------
# 4. Reference age-band distribution (pooled over everything) for
#    direct age-standardisation
# ---------------------------------------------------------------------
REF <- D %>% count(band, name="rn") %>% mutate(w = rn/sum(rn)) %>% select(band, w)
cat("Reference age bands:\n"); print(REF)

# ---------------------------------------------------------------------
# 5. Choose each entity's "circa 2015" wave (nearest 2015; tie -> later)
# ---------------------------------------------------------------------
chosen <- D %>% distinct(entity, wave, year) %>%
  arrange(entity, abs(year-2015), desc(year)) %>%
  group_by(entity) %>% slice(1) %>% ungroup() %>%
  filter(abs(year - 2015) <= 5) %>%           # only entities with data within ~5yrs of 2015
  transmute(entity, c_wave=wave, c_year=year)
cat("\n'circa 2015' source wave per entity:\n"); print(as.data.frame(chosen %>% arrange(c_year, entity)))

# ---------------------------------------------------------------------
# 6. Aggregator: raw + age-standardised means per bin
# ---------------------------------------------------------------------
aggr <- function(df, byvars){
  raw <- df %>% group_by(across(all_of(byvars))) %>%
    summarise(n=n(),
      srh=mean(srh,na.rm=TRUE), casp=mean(casp,na.rm=TRUE), eurod=mean(eurod,na.rm=TRUE),
      ppp_med=median(ppp,na.rm=TRUE), eur_med=median(eur,na.rm=TRUE),   # BEFORE ppp/eur are reassigned to their means
      ppp=mean(ppp,na.rm=TRUE), eur=mean(eur,na.rm=TRUE),
      year=as.integer(round(mean(year,na.rm=TRUE))), .groups="drop")
  bm <- df %>% group_by(across(all_of(c(byvars,"band")))) %>%
    summarise(bsrh=mean(srh,na.rm=TRUE), bcasp=mean(casp,na.rm=TRUE),
              beurod=mean(eurod,na.rm=TRUE), .groups="drop") %>%
    left_join(REF, by="band")
  asd <- bm %>% group_by(across(all_of(byvars))) %>%
    summarise(
      srh_as   = sum(w*bsrh,   na.rm=TRUE)/sum(w*is.finite(bsrh)),
      casp_as  = sum(w*bcasp,  na.rm=TRUE)/sum(w*is.finite(bcasp)),
      eurod_as = sum(w*beurod, na.rm=TRUE)/sum(w*is.finite(beurod)),
      .groups="drop")
  raw %>% left_join(asd, by=byvars) %>%
    mutate(across(c(srh,casp,eurod,srh_as,casp_as,eurod_as,ppp,eur,ppp_med,eur_med),
                  ~ ifelse(is.finite(.x), round(.x,3), NA_real_)))   # NaN/Inf -> NA (null in JSON)
}

build_k <- function(k){
  Dk <- D %>% group_by(entity, wave) %>% mutate(g = dplyr::ntile(ppp, k)) %>% ungroup() %>% filter(!is.na(g))
  # per real wave: SHARE entities only
  perw <- aggr(Dk %>% filter(!is_comp), c("entity","wave","g"))
  # composite ~2015: each entity's chosen wave, relabelled c2015 (year kept)
  comp <- aggr(Dk %>% inner_join(chosen, by=c("entity","wave"="c_wave")),
               c("entity","g")) %>% mutate(wave="c2015")
  # pooled all
  allw <- aggr(Dk, c("entity","g")) %>% mutate(wave="all", year=NA_integer_)
  bind_rows(perw, comp, allw)
}
bins10 <- build_k(10); bins5 <- build_k(5)

# --- mean vs median PPP income by decile (composite ~2015, averaged over entities) ---
cat("\n=== mean vs median PPP income by decile (composite, avg over entities) ===\n")
cmp <- bins10 %>% filter(wave=="c2015") %>% group_by(g) %>%
  summarise(mean_ppp=round(mean(ppp,na.rm=TRUE)), median_ppp=round(mean(ppp_med,na.rm=TRUE)),
            mean_over_median=round(mean(ppp,na.rm=TRUE)/mean(ppp_med,na.rm=TRUE),2), .groups="drop")
print(as.data.frame(cmp))
cat(sprintf("Max MEAN ppp bin: %s | Max MEDIAN ppp bin: %s\n",
    format(round(max(bins10$ppp,na.rm=TRUE)),big.mark=","), format(round(max(bins10$ppp_med,na.rm=TRUE)),big.mark=",")))
cat("Top-decile mean vs median for a few entities (composite):\n")
print(as.data.frame(bins10 %>% filter(wave=="c2015", g==10, entity %in% c("Bulgaria","Germany","United States","Switzerland")) %>%
  transmute(entity, mean_ppp=round(ppp), median_ppp=round(ppp_med))))

# ---------------------------------------------------------------------
# 7. Entity meta
# ---------------------------------------------------------------------
meta <- D %>% group_by(entity) %>%
  summarise(n_total=n(), survey=first(survey), region=first(region),
            is_comp=first(is_comp), .groups="drop") %>%
  mutate(iso3 = ifelse(entity %in% names(iso_map), iso_map[entity],
                       ifelse(entity=="England","GBR", ifelse(entity=="United States","USA",NA))),
         price_level = round(ifelse(entity=="United States", PL_US,
                             ifelse(entity=="England", PL_UK, pl_ctry[entity])), 3))

cat("\nEntities:", nrow(meta), "| comparators:", sum(meta$is_comp), "\n")
cat("Countries in composite ~2015 by source year:\n")
print(chosen %>% count(c_year) %>% arrange(c_year))
cat("\nSample: United States c2015 quintiles:\n")
print(as.data.frame(bins5 %>% filter(entity=="United States", wave=="c2015")))

# ---------------------------------------------------------------------
# 8. Emit JSON
# ---------------------------------------------------------------------
WAVE_ORDER <- c("1","2","4","5","6","8","9","c2015","all")
WAVE_YEARS <- list(`1`="2004",`2`="2006-07",`4`="2011",`5`="2013",`6`="2015",
                   `8`="2019-20",`9`="2021-22",c2015="~2015 (all surveys)",all="all waves (pooled)")

grp_block <- function(b, en, wv){
  bb <- b[b$entity==en & b$wave==wv, ]; bb <- bb[order(bb$g), ]
  list(g=bb$g, srh=bb$srh, srh_as=bb$srh_as, casp=bb$casp, casp_as=bb$casp_as,
       eurod=bb$eurod, eurod_as=bb$eurod_as, ppp=bb$ppp, ppp_med=bb$ppp_med,
       eur=bb$eur, eur_med=bb$eur_med, n_bin=bb$n)
}

out <- list(
  meta = list(
    generated_from="SHARE Rel 9.0.0 + ELSA (harmonized) + HRS (RAND/harmonized)",
    eurusd_2017=EURUSD_2017, gbpusd_2017=GBPUSD_2017,
    default_wave="c2015", wave_order=WAVE_ORDER, wave_years=WAVE_YEARS,
    measures=list(
      srh   = list(label="Self-rated health (mean, reversed)", better="up",   dp=2, cross=TRUE),
      casp  = list(label="Quality of life / life satisfaction (CASP-12)", better="up", dp=1, cross=FALSE),
      eurod = list(label="Depression symptoms (EURO-D)", better="down", dp=2, cross=FALSE)
    ),
    note="Income deciles/quintiles within entity x wave. Absolute income PPP-adjusted (World Bank 2017 price levels, US=1), int'l $. Raw & age-standardised (5-yr bands). SHARE Israel excluded. Self-rated health harmonised across SHARE/ELSA/HRS; CASP & EURO-D are SHARE-only."
  ),
  countries = lapply(split(meta, meta$entity), function(m){
    en  <- m$entity
    wvs <- intersect(WAVE_ORDER, unique(bins10$wave[bins10$entity==en]))
    waves <- setNames(lapply(wvs, function(wv){
      yr <- bins10$year[bins10$entity==en & bins10$wave==wv][1]
      list(year = as.integer(yr),
           `10`=grp_block(bins10,en,wv), `5`=grp_block(bins5,en,wv))
    }), wvs)
    list(name=en, iso3=m$iso3, region=m$region, survey=m$survey, is_comp=m$is_comp,
         n=m$n_total, price_level=m$price_level, wave_list=wvs, waves=waves)
  })
)
writeLines(toJSON(out, auto_unbox=TRUE, na="null", digits=4), "chart_data.json")
cat("\nWROTE chart_data.json (", file.info("chart_data.json")$size, "bytes )\n")
