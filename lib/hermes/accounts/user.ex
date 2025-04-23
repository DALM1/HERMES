defmodule Hermes.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hermes.Accounts.User
  alias Hermes.Chat.{ConversationMember, Message, Reaction}

  schema "users" do
    field :username, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :full_name, :string
    field :bio, :string
    field :profile_picture, :string
    field :last_seen_at, :utc_datetime
    field :is_online, :boolean, default: false
    field :is_verified, :boolean, default: false
    field :settings, :map, default: %{}

    has_many :conversation_members, ConversationMember
    has_many :conversations, through: [:conversation_members, :conversation]
    has_many :messages, Message
    has_many :reactions, Reaction

    timestamps()
  end

  def registration_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:username, :email, :password, :full_name])
    |> validate_required([:username, :email, :password])
    |> validate_length(:username, min: 3, max: 30)
    |> validate_length(:password, min: 6)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:username)
    |> unique_constraint(:email)
    |> put_password_hash()
  end

  def update_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:full_name, :bio, :profile_picture, :settings])
    |> validate_length(:bio, max: 500)
  end

  defp put_password_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, password_hash: Bcrypt.hash_pwd_salt(password))
  end

  defp put_password_hash(changeset), do: changeset
end