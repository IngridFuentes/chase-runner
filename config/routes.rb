Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "/users", to: "users#index"
      get "/get_current_user", to: "sessions#get_current_user"
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
      resources :runs
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end