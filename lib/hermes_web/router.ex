defmodule HermesWeb.Router do
  use HermesWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug Hermes.Guardian.Pipeline
  end

  scope "/api", HermesWeb do
    pipe_through :api

    post "/register", AuthController, :register
    post "/login", AuthController, :login
  end

  # Add this new scope for direct access to conversations
  scope "/", HermesWeb do
    pipe_through [:api, :auth]

    resources "/conversations", ConversationController, except: [:new, :edit]
  end

  scope "/api", HermesWeb do
    pipe_through [:api, :auth]

    post "/logout", AuthController, :logout
    get "/users/me", UserController, :me
    resources "/users", UserController, except: [:new, :edit, :create]

    # Add standalone messages resource
    resources "/messages", MessageController, only: [:create, :update, :delete]

    resources "/conversations", ConversationController, except: [:new, :edit] do
      resources "/messages", MessageController, only: [:index, :create]
      post "/members", ConversationController, :add_member
      delete "/members/:user_id", ConversationController, :remove_member
      post "/read", ConversationController, :mark_as_read
    end
    get "/posts", PostController, :index
    get "/groups/user", GroupController, :user_groups
    # Autres routes API...



    # Nouvelles routes pour les conversations publiques
    get "/public-conversations", ConversationController, :public
    post "/conversations/:id/join", ConversationController, :join

    post "/messages/:id/reactions", MessageController, :add_reaction
    delete "/messages/:id/reactions", MessageController, :remove_reaction
  end
end
