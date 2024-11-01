// 高德地图天气接口API密钥，需自行替换为真实密钥
const WEATHER_API_KEY = "YOUR_WEATHER_API_KEY";
// 城市代码，需自行替换为目标城市代码
const CITY_CODE = "YOUR_CITY_CODE";
// 手机推送接口地址，需自行替换为真实完整的接口地址
const PUSH_API_URL = "YOUR_PUSH_API_URL";

const WEATHER_API_URL = `https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY_CODE}&key=${WEATHER_API_KEY}&extensions=all`;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    try {
        const weatherData = await getWeather();
        const weatherText = formatWeatherText(weatherData);
        const pushResponse = await fetch(PUSH_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
            body: weatherText
        });

        if (pushResponse.ok) {
            return new Response("天气预报信息已成功推送给手机", { status: 200 });
        } else {
            return new Response("推送天气预报信息到手机失败", { status: 500 });
        }
    } catch (error) {
        return new Response("获取天气数据或推送过程中出现错误：" + error.message, { status: 500 });
    }
}

function formatWeatherText(weatherData) {
    let text = "【天气预报】\n";

    const forecasts = weatherData.forecasts[0];
    const city = forecasts.city;
    const province = forecasts.province;

    text += `城市：${city}（${province}）\n`;

    forecasts.casts.forEach((cast, index) ) {
        const date = cast.date;
        const week = cast.week;
        const dayWeather = cast.dayweather;
        const nightWeather = cast.nightweather;
        const dayTemp = cast.daytemp;
        const nightTemp = cast.nighttemp;
        const dayWind = cast.daywind;
        const nightWind = cast.nightwind;

        text += `\n--- 日期：${date}（星期${week}）---\n`;
        text += `白天天气：${dayWeather}\n`;
        text += `晚上天气：${夜Weather}\n`;
        text += `白天温度：${dayTemp}℃\n`;
        text += `晚上温度：${nightTemp}℃\n`;
        text += `白天风向：${dayWind}\n`;
        text += `晚上风向：${nightWind}\n`;

        if (index < forecasts.casts.length - 1) {
            text += "----------------\n";
        }
    });

    return text;
}

async function getWeather() {
    const response = await fetch(WEATHER_API_URL);
    if (response.ok) {
        return await response.json();
    } else {
        return {
            status: "获取天气信息失败",
            forecasts: []
        };
    }
}