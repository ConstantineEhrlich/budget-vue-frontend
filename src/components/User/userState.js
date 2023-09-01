import {defineStore} from 'pinia';
import { getUserProfile, userLogout } from './UserController';

export const useUserState = defineStore({
    id: 'user',
    state: () => ({
        authenticated: false,
        profile: null,
        budgetId: null,
        }),
    actions: {
        setProfile(profile){
            this.profile = profile;
            this.authenticated = true;
        },

        async fetchProfile(){
            // Before fetchning the profile, load saved budget
            this.budgetId = this.loadBudget();

            // Try to fetch user profile
            try{
                let serverProfile = await getUserProfile();
                this.setProfile(serverProfile);
            }
            // Unauthorized
            catch(error){
                this.profile = null;
            }
        },

        async logout(){
            await userLogout();
            this.profile = null;
            this.authenticated = false;
        },

        saveBudget(id){
            this.budgetId = id;
            localStorage.setItem('budgetId', this.budgetId);
        },

        loadBudget(){
            return localStorage.getItem('budgetId');
        }
        
    },
});