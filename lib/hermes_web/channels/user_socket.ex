defmodule HermesWeb.UserSocket do
  use Phoenix.Socket

  channel "conversation:*", HermesWeb.ConversationChannel

  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    case Hermes.Guardian.decode_and_verify(token) do
      {:ok, claims} ->
        case Hermes.Guardian.resource_from_claims(claims) do
          {:ok, user} ->
            {:ok, assign(socket, :current_user, user)}
          _ ->
            :error
        end
      _ ->
        :error
    end
  end

  @impl true
  def id(socket), do: "user_socket:#{socket.assigns.current_user.id}"
end