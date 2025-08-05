<p align="center">
  <a href="https://juicyllama.com/" target="_blank">
    <img src="https://juicyllama.com/assets/images/icon.png" width="100" alt="JuicyLlama Logo" />
  </a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>



<p align="center">
A NestJS app for integrating with Google Tag Manager API
</p>

<h2 align="center">
Sponsored By
</h2>

<p align="center">
  <a href="https://clicktech.com/" target="_blank">
    <img src="https://clicktech.com/wp-content/uploads/2024/07/clicktech-logo.png" alt="ClickTech Logo" />
  </a>
</p>
<p align="center">
Clicktech help businesses succeed online.
</p>
<p align="center">
Their mission is to make digital marketing accessible and more cost-effective for all businesses, regardless of size.
</p>
<p align="center">
Through their network of platforms, integrated partners, and educational resources, they aim to create a meaningful economic impact by helping millions of businesses succeed online.
</p>

## Install

```bash
npm i @juicyllama/nestjs-google-tag-manager-api
```

## Usage

1. Create an Oauth2 application in your Google API Console. Google then provides information you'll need later, such as a client ID and a client secret.
2. Activate the Tag Manager API in the Google API Console. (If the API isn't listed in the API Console, then skip this step)
3. Add the client ID and a client secret to the `.env` and boot up your NestJS application
2. Authenticate your NestJS application with GTM (#Oauth2)
3. Integrate your NestJS application with the relevant modules (e.g. endpoints) required

You can checkout the [Sandbox](./src/sandbox/) for an example implementation.

### Oauth2

Once you have the module running in your app, it automatically exposes the endpoints required to connect via OAuth2

Visit: `/app/gtm/auth` and connect to your GTM account

### Cache / Redis

As standard the app will use local memory for storing the OAuth Tokens which is not best practice as you will need to reauth each time you restart the service (and the memory is cleared).

We recommend using Redis which ships out of the box, provide your redis environment values and the cache will revert to redis.

```bash
REDIS_PORT=localhost
REDIS_HOST=6379
```

## Types

We have typed each resource type and have exported them for your use. 

You can import them into your code and reuse them.

## Testing

We are using mock data (mirrored from the Google Tag Manager documentation) to perform testing.
