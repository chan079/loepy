# 준비

## Python 준비

폴더(예를 들어 `loepy`)를 하나 만든다. 그 안에서 작업할 것이다.

UV를 [설치하고](https://docs.astral.sh/uv/getting-started/installation/) `loepy` 폴더 안에서 다음 명령으로 uv 환경을 만든다.

```console
$ uv init
$ uv add numpy pandas statsmodels scipy matplotlib
```

`statsmodels`는 회귀분석, `numpy`는 log나 exp 등, `pandas`는 CSV 파일
등 읽기, `matplotlib`은 그림, `scipy`는 t분포 등의 CDF와 임계값 등에
사용된다.

UV는 사용하기 간편해서 이걸 중심으로 설명하려는 것뿐이다. UV를 사용하지 않고 global하게 설치돼 있는 python을 사용하거나(이 경우 `pip install ...` 명령으로 패키지 설치) conda 등 가상환경을 사용해도 좋다.

## 데이터 준비

데이터를 CSV 형태로 만들어 python에서 사용하고자 한다. 우선 R에서 다음을 실행하여 필요한 패키지를 설치한다.

```r title="R"
## R에서 실행
pkgs <- c("loedata", "gamair", "Ecdat", "AER", "wooldridge", "sampleSelection")
for (pkg in setdiff(pkgs, installed.packages())) install.packages(pkg)
```

다음으로 R에서 데이터셋들을 CSV 형태로 변환하여 저장할 것이다. 다음 R
코드를 클립보드에 복사한 후 R 콘솔(R, 터미널, Rstudio 등)에 붙여 넣어
실행한다. 그러면 R 데이터가 CSV 형식으로 변환되어 현 디렉토리(R 코드가
실행되고 있는 디렉토리로서 getwd()로써 알 수 있음)의 csv 하위 폴더에
저장된다. 이렇게 csv 폴더가 만들어지면 이 csv 폴더를 작업하고자 하는
폴더에 복사하면 된다. 필자의 경우 홈 디렉토리 내 doc/thebook/python
폴더 내에 csv 폴더가 있고, doc/thebook/python 폴더에서 파이썬 코딩을
하고 있다.

```r title="R"
## R에서 실행
What <- list(
    loedata = c('Death', 'Klips', 'Pubserv', 'Ekc', 'Galtonpar', 'Hcons',
        'Klosa', 'Ksalary', 'Regko', 'Fastfood', 'Hies', 'Ivdata', 'Hmda'),
    gamair = c('hubble'),
    Ecdat = c('Cigar', 'Consumption', 'Crime', 'Housing', 'Wages1', 'Wages',
        'Doctor', 'Schooling', 'Tobacco'),
    AER = c('CigarettesB'),
    wooldridge = c('twoyear', 'smoke', 'wage2'),
    sampleSelection = c('Mroz87'))

topdir = 'csv'
if (!dir.exists(topdir)) dir.create(topdir)

for (pkg in names(What)) {
  cat(pkg, ':', sep='')
  outdir <- file.path(topdir, pkg)
  if (!dir.exists(outdir)) dir.create(outdir)
  for (dta in What[[pkg]]) {
    cat(' ', dta, sep='')
    outfile <- file.path(outdir, paste0(dta, '.csv'))
    eval(parse(text = sprintf('data(%s, package = "%s")', dta, pkg)))
    z <- get(dta)
    if (dta == 'CigarettesB' && pkg == 'AER') {
      z$state <- rownames(z)
      z <- z[c('state', setdiff(names(z), 'state'))]
    }
    write.csv(z, file = outfile, row.names = FALSE)
  }
  cat("\n")
}
```

위 코드의 실행이 끝나면 현 디렉토리의 `csv` 폴더 아래에 패키지명에 해당하는 폴더들이
생기고 이들 각 폴더 안에 데이터 CSV 파일이 생성된다. `csv` 폴더를 열어
보면 무슨 말인지 알 수 있을 것이다. 마지막으로, `csv` 폴더를 위에서 생성한 `loepy` 폴더로 이동한다.

## 디렉토리 구조

최종적인 디렉토리 구조는 다음과 같다.

```text title="directory structure"
loepy
├── csv
│   ├── AER
│   │   └── CigarettesB.csv
│   ├── Ecdat
│   │   ├── Cigar.csv
│   │   ├── Consumption.csv
│   │   ├── Crime.csv
│   │   ├── Doctor.csv
│   │   ├── Housing.csv
│   │   ├── Schooling.csv
│   │   ├── Tobacco.csv
│   │   ├── Wages.csv
│   │   └── Wages1.csv
│   ├── gamair
│   │   └── hubble.csv
│   ├── loedata
│   │   ├── Death.csv
│   │   ├── Ekc.csv
│   │   ├── Fastfood.csv
│   │   ├── Galtonpar.csv
│   │   ├── Hcons.csv
│   │   ├── Hies.csv
│   │   ├── Hmda.csv
│   │   ├── Ivdata.csv
│   │   ├── Klips.csv
│   │   ├── Klosa.csv
│   │   ├── Ksalary.csv
│   │   ├── Pubserv.csv
│   │   └── Regko.csv
│   ├── sampleSelection
│   │   └── Mroz87.csv
│   └── wooldridge
│       ├── smoke.csv
│       ├── twoyear.csv
│       └── wage2.csv
├── main.py
├── pyproject.toml
├── README.md
└── uv.lock
```
