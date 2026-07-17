# organize-media.ps1
# Copies and sanitizes media from "Resume Photos" into public/images and public/resume
# Generates src/data/media-manifest.json

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $Root "package.json"))) {
  # script may live at repo root/scripts
  $Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}
Set-Location $Root

$SourceRoot = Join-Path $Root "Resume Photos"
if (-not (Test-Path $SourceRoot)) {
  throw "Resume Photos folder not found at: $SourceRoot"
}

function Sanitize-FileName {
  param([string]$Name)
  $base = [System.IO.Path]::GetFileNameWithoutExtension($Name)
  $ext = [System.IO.Path]::GetExtension($Name).ToLowerInvariant()
  $sanitized = $base.ToLowerInvariant()
  $sanitized = $sanitized -replace '[^\p{L}\p{Nd}]+', '-'
  $sanitized = $sanitized -replace '-+', '-'
  $sanitized = $sanitized.Trim('-')
  if ([string]::IsNullOrWhiteSpace($sanitized)) { $sanitized = "file" }
  return "$sanitized$ext"
}

function Get-MediaType {
  param([string]$Ext)
  $e = $Ext.ToLowerInvariant()
  switch -Regex ($e) {
    '^\.(jpe?g|png|gif|webp|avif|bmp|svg|heic|tif{1,2})$' { return "image" }
    '^\.(mp4|mov|webm|m4v|avi|mkv)$' { return "video" }
    '^\.pdf$' { return "pdf" }
    default { return "image" }
  }
}

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Copy-Sanitized {
  param(
    [string]$SourceFile,
    [string]$DestDir,
    [string]$Category,
    [System.Collections.Generic.List[object]]$Manifest
  )
  Ensure-Dir $DestDir
  $originalName = [System.IO.Path]::GetFileName($SourceFile)
  $safeName = Sanitize-FileName $originalName
  $destPath = Join-Path $DestDir $safeName

  # Avoid overwrites: append counter if needed
  $i = 1
  $stem = [System.IO.Path]::GetFileNameWithoutExtension($safeName)
  $ext = [System.IO.Path]::GetExtension($safeName)
  while (Test-Path $destPath) {
    $safeName = "$stem-$i$ext"
    $destPath = Join-Path $DestDir $safeName
    $i++
  }

  Copy-Item -LiteralPath $SourceFile -Destination $destPath -Force

  $publicRoot = Join-Path $Root "public"
  $rel = $destPath.Substring($publicRoot.Length).Replace('\', '/')
  if (-not $rel.StartsWith('/')) { $rel = "/$rel" }

  $Manifest.Add([pscustomobject]@{
    category     = $Category
    originalName = $originalName
    src          = $rel
    type         = (Get-MediaType $ext)
  }) | Out-Null
}

function Copy-FolderContents {
  param(
    [string]$SourceDir,
    [string]$DestDir,
    [string]$Category,
    [System.Collections.Generic.List[object]]$Manifest,
    [switch]$Recurse,
    [switch]$RootFilesOnly
  )
  if (-not (Test-Path $SourceDir)) {
    Write-Warning "Missing source: $SourceDir"
    return
  }
  if ($RootFilesOnly) {
    Get-ChildItem -LiteralPath $SourceDir -File | ForEach-Object {
      Copy-Sanitized $_.FullName $DestDir $Category $Manifest
    }
  } elseif ($Recurse) {
    Get-ChildItem -LiteralPath $SourceDir -File -Recurse | ForEach-Object {
      $relDir = $_.DirectoryName.Substring($SourceDir.Length).TrimStart('\', '/')
      $target = if ([string]::IsNullOrWhiteSpace($relDir)) { $DestDir } else {
        $parts = $relDir -split '[\\/]' | ForEach-Object {
          ($_ -replace '[^\p{L}\p{Nd}]+', '-').ToLowerInvariant().Trim('-')
        }
        Join-Path $DestDir ($parts -join [IO.Path]::DirectorySeparatorChar)
      }
      $cat = if ([string]::IsNullOrWhiteSpace($relDir)) { $Category } else {
        $sanCat = ($relDir -replace '[\\/]', '/').ToLowerInvariant() -replace '[^\p{L}\p{Nd}/]+', '-'
        "$Category/$sanCat"
      }
      Copy-Sanitized $_.FullName $target $cat $Manifest
    }
  } else {
    Get-ChildItem -LiteralPath $SourceDir -File | ForEach-Object {
      Copy-Sanitized $_.FullName $DestDir $Category $Manifest
    }
  }
}

# Destination folders
$ImageDirs = @(
  "01_Hero", "02_AI_Farms", "03_Project_AEGIS", "04_Research",
  "05_Internships", "06_Leadership", "07_Awards", "08_Photography",
  "09_Campus", "10_Family", "11_Industry", "12_PC_Build", "13_Logos"
)
$PublicImages = Join-Path $Root "public/images"
Ensure-Dir $PublicImages
foreach ($d in $ImageDirs) { Ensure-Dir (Join-Path $PublicImages $d) }
Ensure-Dir (Join-Path $PublicImages "05_Internships/coca-cola")
Ensure-Dir (Join-Path $PublicImages "05_Internships/industry")
Ensure-Dir (Join-Path $Root "public/resume")

$manifest = [System.Collections.Generic.List[object]]::new()

# Mappings
Copy-FolderContents (Join-Path $SourceRoot "01_Headshots") (Join-Path $PublicImages "01_Hero") "01_Hero" $manifest
Copy-FolderContents (Join-Path $SourceRoot "02_AI_Farms") (Join-Path $PublicImages "02_AI_Farms") "02_AI_Farms" $manifest
Copy-FolderContents (Join-Path $SourceRoot "03_Project_AEGIS") (Join-Path $PublicImages "03_Project_AEGIS") "03_Project_AEGIS" $manifest
Copy-FolderContents (Join-Path $SourceRoot "07_Research_Posters") (Join-Path $PublicImages "04_Research") "04_Research" $manifest

# Presentations, publications, testimonials (nested under Research / Leadership)
Copy-FolderContents (Join-Path $SourceRoot "08_Presentations") (Join-Path $PublicImages "04_Research/presentations") "04_Research/presentations" $manifest -Recurse
Copy-FolderContents (Join-Path $SourceRoot "15_Publications") (Join-Path $PublicImages "04_Research/publications") "04_Research/publications" $manifest -Recurse
Copy-FolderContents (Join-Path $SourceRoot "16_Testimonials") (Join-Path $PublicImages "06_Leadership/testimonials") "06_Leadership/testimonials" $manifest -Recurse

Copy-FolderContents (Join-Path $SourceRoot "06_Coca_Cola_Internship") (Join-Path $PublicImages "05_Internships/coca-cola") "05_Internships/coca-cola" $manifest

# Industry folder (various possible names)
$industryCandidates = @(
  (Join-Path $SourceRoot "Industry"),
  (Join-Path $SourceRoot "11_Industry"),
  (Join-Path $SourceRoot "industry")
)
foreach ($ind in $industryCandidates) {
  if (Test-Path $ind) {
    Copy-FolderContents $ind (Join-Path $PublicImages "05_Internships/industry") "05_Internships/industry" $manifest -Recurse
    # Also mirror into 11_Industry for experience section convenience
    Copy-FolderContents $ind (Join-Path $PublicImages "11_Industry") "11_Industry" $manifest -Recurse
  }
}

Copy-FolderContents (Join-Path $SourceRoot "10_Leadership and Volunteer") (Join-Path $PublicImages "06_Leadership") "06_Leadership" $manifest

# Awards: root files only (not 17_Family)
$awardsRoot = Join-Path $SourceRoot "Awards"
if (Test-Path $awardsRoot) {
  Copy-FolderContents $awardsRoot (Join-Path $PublicImages "07_Awards") "07_Awards" $manifest -RootFilesOnly
  $family = Join-Path $awardsRoot "17_Family_On_Campus"
  if (Test-Path $family) {
    Copy-FolderContents $family (Join-Path $PublicImages "10_Family") "10_Family" $manifest
  }
}

# Photography with subfolders preserved
$photoRoot = Join-Path $SourceRoot "12_Photography"
if (Test-Path $photoRoot) {
  # Root-level files -> general
  Get-ChildItem -LiteralPath $photoRoot -File | ForEach-Object {
    Copy-Sanitized $_.FullName (Join-Path $PublicImages "08_Photography/general") "08_Photography/general" $manifest
  }
  # Subfolders
  Get-ChildItem -LiteralPath $photoRoot -Directory | ForEach-Object {
    $catName = ($_.Name -replace '[^\p{L}\p{Nd}]+', '-').ToLowerInvariant().Trim('-')
    if ([string]::IsNullOrWhiteSpace($catName)) { $catName = "general" }
    Copy-FolderContents $_.FullName (Join-Path $PublicImages "08_Photography/$catName") "08_Photography/$catName" $manifest -Recurse
  }
}

# Logos / backgrounds
$logoCandidates = @(
  (Join-Path $SourceRoot "backgroundsand logos"),
  (Join-Path $SourceRoot "backgrounds and logos"),
  (Join-Path $SourceRoot "13_Logos"),
  (Join-Path $SourceRoot "Logos")
)
foreach ($logo in $logoCandidates) {
  if (Test-Path $logo) {
    Copy-FolderContents $logo (Join-Path $PublicImages "13_Logos") "13_Logos" $manifest -Recurse
  }
}

# PC Build
$pcCandidates = @(
  (Join-Path $SourceRoot "PC build"),
  (Join-Path $SourceRoot "PC Build"),
  (Join-Path $SourceRoot "12_PC_Build"),
  (Join-Path $SourceRoot "pc-build")
)
foreach ($pc in $pcCandidates) {
  if (Test-Path $pc) {
    Copy-FolderContents $pc (Join-Path $PublicImages "12_PC_Build") "12_PC_Build" $manifest -Recurse
  }
}

# Campus if present
$campusCandidates = @(
  (Join-Path $SourceRoot "09_Campus"),
  (Join-Path $SourceRoot "Campus")
)
foreach ($c in $campusCandidates) {
  if (Test-Path $c) {
    Copy-FolderContents $c (Join-Path $PublicImages "09_Campus") "09_Campus" $manifest -Recurse
  }
}

# Resume PDFs from 14_Resume
$resumeSrc = Join-Path $SourceRoot "14_Resume"
$resumeDest = Join-Path $Root "public/resume"
if (Test-Path $resumeSrc) {
  Get-ChildItem -LiteralPath $resumeSrc -File -Filter *.pdf | ForEach-Object {
    Copy-Sanitized $_.FullName $resumeDest "resume" $manifest
  }
}

# Root resume.pdf
$rootResume = Join-Path $Root "resume.pdf"
if (Test-Path $rootResume) {
  Ensure-Dir $resumeDest
  $destResume = Join-Path $resumeDest "Cameron_Jones_Resume.pdf"
  Copy-Item -LiteralPath $rootResume -Destination $destResume -Force
  $manifest.Add([pscustomobject]@{
    category     = "resume"
    originalName = "resume.pdf"
    src          = "/resume/Cameron_Jones_Resume.pdf"
    type         = "pdf"
  }) | Out-Null
}

# Write manifest
$dataDir = Join-Path $Root "src/data"
Ensure-Dir $dataDir
$manifestPath = Join-Path $dataDir "media-manifest.json"
$manifest | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $manifestPath

Write-Host "Organized $($manifest.Count) media files."
Write-Host "Manifest: $manifestPath"

# Per-folder counts
Get-ChildItem -LiteralPath $PublicImages -Directory | ForEach-Object {
  $count = (Get-ChildItem -LiteralPath $_.FullName -File -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
  Write-Host ("{0,-20} {1}" -f $_.Name, $count)
}
$resumeCount = (Get-ChildItem -LiteralPath $resumeDest -File -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host ("{0,-20} {1}" -f "resume", $resumeCount)

