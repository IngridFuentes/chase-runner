Rails.application.routes.draw do

  devise_for :users
  
  root 'welcome#home'
  get '/welcome/home', to: 'welcome#home'
  # get 'welcome/app'
  # get '/app', to: 'welcome#app', as: 'app'
  # devise_for :users, path: '', path_names: {
  #   sign_in: 'login',
  #   sign_out: 'logout',
  #   registration: 'signup'
  # },
  # controllers: {
  #   sessions: 'users/sessions',
  #   registrations: 'users/registrations'
  # }

  # resources :csrf_tokens, only: [:index]

  # namespace :api do
  #   namespace :v1 do
      # get "/users", to: "users#index"
      # get "/get_current_user", to: "sessions#get_current_user"
      # get '/test-session', to: 'application#test_session'
      # post "/login", to: "sessions#create"
      # delete "/logout", to: "sessions#destroy"
  #     resources :runs
  #   end
  # end
end
