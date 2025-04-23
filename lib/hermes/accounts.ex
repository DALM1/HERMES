defmodule Hermes.Accounts do
  import Ecto.Query, warn: false
  alias Hermes.Repo
  alias Hermes.Accounts.User

  def get_user(id), do: Repo.get(User, id)
  def get_user_by(params), do: Repo.get_by(User, params)

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.update_changeset(attrs)
    |> Repo.update()
  end

  def update_last_seen(%User{} = user) do
    now = DateTime.utc_now()
    
    user
    |> Ecto.Changeset.change(%{last_seen_at: now})
    |> Repo.update()
  end

  def set_online_status(%User{} = user, is_online) do
    user
    |> Ecto.Changeset.change(%{is_online: is_online})
    |> Repo.update()
  end

  # Add this function to your Accounts module if it doesn't exist already
  def authenticate_user(email, password) do
    user = Repo.get_by(User, email: email)
    
    case user do
      nil -> 
        {:error, "User not found"}
      user -> 
        if Bcrypt.verify_pass(password, user.password_hash) do
          {:ok, user}
        else
          {:error, "Invalid password"}
        end
    end
  end

  def list_users(criteria \\ []) do
    query = from u in User

    query
    |> filter_by_criteria(criteria)
    |> Repo.all()
  end

  defp filter_by_criteria(query, criteria) do
    Enum.reduce(criteria, query, fn
      {:username, username}, query ->
        from q in query, where: ilike(q.username, ^"%#{username}%")
      {:email, email}, query ->
        from q in query, where: ilike(q.email, ^"%#{email}%")
      {:is_online, is_online}, query ->
        from q in query, where: q.is_online == ^is_online
      _, query ->
        query
    end)
  end
end