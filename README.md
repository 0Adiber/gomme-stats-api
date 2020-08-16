<h1 align="center">Unofficial GommeHD.net Stats API</h1>
<p align="center">
  <img src="https://i.ibb.co/dBvdMZD/Adiber.png" align="center" width="150px" />
</p>
<p align="center">
  <img src="https://img.shields.io/website?down_color=red&down_message=down&style=for-the-badge&up_color=green&up_message=up&url=https%3A%2F%2Fgommestats.azurewebsites.net/" />
  <img src="https://img.shields.io/github/last-commit/0Adiber/gomme-stats-api?color=blue&label=last%20commit&style=for-the-badge" />
</p>
<h2 align="center">https://gommestats.azurewebsites.net/</h2>
There is no official API for retrieving player stats from the GommeHD.net Minecraft server. The only way is to parse the HTML content of their website, which is kinda tedious. This is why I created this little API.

## 🗺️ Usage

The API responds with JSON objects.

### Playerstats
<b>You send: </b>PLAYER as the Minecraft Username of the Player

#### 📜 Request
```
GET /api/v1/stats/player/PLAYER
Content-Type: application/json
Content-Length: xy
```

#### ⭐ Successful Response: 
```json
{
  "message": "Results for PLAYER",
  "data": {
    "ttt": {},
    "skywars": {},
    ...
  }
}
```

#### ⛔ If Player does not exist
```json
{
  "message": "No entries found",
  "data": {}
}
```

### Clanmembers
<b>You send: </b>CLANNAME as the Name of the GommeHD.net Clan

#### 📜 Request
```
GET /api/v1/stats/clan/members/CLANNAME
Content-Type: application/json
Content-Length: xy
```

#### ⭐ Successful Response: 
```json
{
  "message": "Members for CLANNAME",
  "data": {
    "leader": [],
    "mods": [],
    "member": [],
  }
}
```

#### ⛔ If Clan does not exist
```json
{
  "message": "No entries found",
  "data": {}
}
```

### Clanwars
<b>You send: </b>CLANNAME as the Name of the GommeHD.net Clan

#### 📜 Request
```
GET /api/v1/stats/clan/wars/CLANNAME
Content-Type: application/json
Content-Length: xy
```

#### ⭐ Successful Response: 
```json
{
  "message": "Wars for CLANNAME",
  "data": {
    "bw": {
      "rank": "",
      "points": "",
      "wins": "",
      "losses": "",
    },
    "cores": {...},
    "sg": {...},
  }
}
```

#### ⛔ If Clan does not exist
```json
{
  "message": "No entries found",
  "data": {}
}
```

### Status Codes
* 200 - Everything was OK ✔
* 404 - Endpoint does not exist ❓
* 429 - You are sending too many request 🚫

## Todo
- [x] Playerstats
- [x] Clanstats
