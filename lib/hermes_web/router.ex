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

  scope "/api", HermesWeb do
    pipe_through [:api, :auth]

    get "/users/me", UserController, :me
    resources "/users", UserController, except: [:new, :edit, :create]
    
    # Add standalone messages resource
    resources "/messages", MessageController, only: [:create, :update, :delete]
    
    resources "/conversations", ConversationController, except: [:new, :edit] do
      resources "/messages", MessageController, only: [:index]
      post "/members", ConversationController, :add_member
      delete "/members/:user_id", ConversationController, :remove_member
    end
    
    post "/messages/:id/reactions", MessageController, :add_reaction
    delete "/messages/:id/reactions", MessageController, :remove_reaction
  end
end