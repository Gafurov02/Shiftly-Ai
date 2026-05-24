import { defineStore } from 'pinia'

export const useAuthStore =
    defineStore('auth', {
        state: () => ({
            isLoggedIn: false,
            companyJoined: false,

            user: {
                name: 'Gafurov',
                role: 'Bartender',
                company:
                    'Tot Samiy Gastropub',
                shift: '10:00 — 23:30'
            }
        }),

        actions: {
            login() {
                this.isLoggedIn = true
            },

            joinCompany() {
                this.companyJoined = true
            },

            logout() {
                this.isLoggedIn = false
                this.companyJoined = false
            }
        }
    })