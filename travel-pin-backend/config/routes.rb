Rails.application.routes.draw do
  resources :cities
  resources :photos
  resources :boards
  resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
