FROM elixir:1.18-alpine AS build

RUN apk add --no-cache build-base npm git python3

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get --only prod
RUN mix deps.compile

COPY lib lib
COPY priv priv

# Commentez ces lignes si les dossiers ou commandes n'existent pas
# RUN cd assets && npm install && npm run deploy
# RUN mix phx.digest

RUN mix compile
RUN mkdir -p rel
RUN mix release.init
RUN mix release

FROM alpine:3.18 AS app
RUN apk add --no-cache openssl ncurses-libs libstdc++

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/hermes ./

ENV HOME=/app
ENV MIX_ENV=prod
ENV PORT=4000

CMD ["bin/hermes", "start"]
