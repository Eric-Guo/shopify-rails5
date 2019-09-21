Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'user/sessions',
                                    passwords: 'user/passwords',
                                    confirmations: 'user/confirmations',
                                    unlocks: 'user/unlocks',
                                    registrations: 'user/registrations' }
  resources :vendors, only: :index
  mount ShopifyApp::Engine, at: '/'
  root to: 'home#index'
end
