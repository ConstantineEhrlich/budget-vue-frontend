import {defineStore} from 'pinia';
import { getUserProfile, userLogout } from './UserController';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        authenticated: false,
        profile: null,
        }),
    actions: {
        setProfile(profile){
            this.profile = profile;
            this.authenticated = true;
        },

        async fetchProfile(){
            try{
                let serverProfile = await getUserProfile();
                this.setProfile(serverProfile);
            }
            catch(error){
                this.profile = null;
            }
        },

        async logout(){
            await userLogout();
            this.profile = null;
            this.authenticated = false;
        },
        
    },
});