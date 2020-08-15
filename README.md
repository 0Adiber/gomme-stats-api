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
#### 📍 Endpoint
`GET api/v1/stats/player/PLAYER`
<br>Where PLAYER is the Name of the Player
#### 💌 Response:
```json
{
  "message": "Results for PLAYER",
  "data": {...}
}
```
⛔ If Player does not exist
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
- [ ] Clanstats
