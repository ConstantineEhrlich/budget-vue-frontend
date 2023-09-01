import {defineStore} from 'pinia';
import { getUserProfile, userLogout } from './userController';
import { getBudget } from '../Budget/budgetController';

export const useUserState = defineStore({
    id: 'user',
    state: () => ({
        authenticated: false,
        isOwner: false,
        profile: null,
        budget: null,
        budgetId: null,
        }),
    actions: {
        setProfile(profile){
            this.profile = profile;
            this.authenticated = true;
        },

        async fetchProfile(){
            // Try to fetch user profile
            try{
                let serverProfile = await getUserProfile();
                this.setProfile(serverProfile);
                
                // Try to load saved budget
                if(this.storedBudgetPresent()){
                    const bdg = await getBudget(this.budgetId);
                    this.budget = bdg;
                    this.isOwner = this.checkOwner();
                    
                }
            }
            // Unauthorized
            catch(error){
                this.profile = null;
            }
        },

        async logout(){
            await userLogout();
            this.profile = null;
            this.budgetId = null;
            this.authenticated = false;
        },

        saveBudget(budget){
            this.budget = budget;
            this.budgetId = budget.id;
            this.isOwner = this.checkOwner();
            localStorage.setItem('budgetId', this.budgetId);
        },

        storedBudgetPresent(){
            this.budgetId =  localStorage.getItem('budgetId');
            return this.budgetId != null;
        },

        checkOwner(){
            return this.budget.owners.map(o => o.id).includes(this.profile.id);
        }
        
    },
});