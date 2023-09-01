import {defineStore} from 'pinia';
import { getUserProfile, userLogout } from './UserController';

export const useUserState = defineStore({
    id: 'user',
    state: () => ({
        authenticated: false,
        profile: null,
        budgetSelected: false,
        budgetId: null,
        }),
    actions: {
        setProfile(profile){
            this.profile = profile;
            this.authenticated = true;
        },

        async fetchProfile(){
            // This method is called when app is initialized
            this.budgetId = this.getSavedBudget();
            // Try to fetch user profile
            try{
                let serverProfile = await getUserProfile();
                this.setProfile(serverProfile);
                this.budgetId = this.getSavedBudget;
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

        setSavedBudget(id){
            this.budgetId = id;
            localStorage.setItem('budgetId', this.budgetId);
        },

        getSavedBudget(){
            let budgetId = localStorage.getItem('budgetId');
            if(budgetId){
                this.budgetSelected = true;
                this.budgetId = budgetId;
            }
            else{
                this.budgetSelected = false;
            }
        }
        
    },
});