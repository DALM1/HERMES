FROM elixir:1.18-alpine AS build

# Install build dependencies
RUN apk add --no-cache build-base npm git python3

WORKDIR /app

# Install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Set build ENV
ENV MIX_ENV=prod

# Install mix dependencies
COPY mix.exs mix.lock ./
# Assurez-vous que les fichiers de configuration sont copiés
COPY config config
RUN mix deps.get --only prod
RUN mix deps.compile

# Vérifier si les dossiers existent avant de les copier
# Commentez ou supprimez les lignes qui font référence à des dossiers inexistants

# Copier les fichiers de l'application
COPY lib lib
# COPY assets assets  # Commenté car le dossier n'existe pas
COPY priv priv

# Commentez ces lignes si les dossiers ou commandes n'existent pas
# RUN cd assets && npm install && npm run deploy
# RUN mix phx.digest

# Compile and build release
RUN mix compile
# Créer le dossier rel s'il n'existe pas
RUN mkdir -p rel
# Générer les fichiers de release
RUN mix release.init
RUN mix release

# Prepare release image
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