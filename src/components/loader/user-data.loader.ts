import { useAuth } from '../../common/hooks/useAuth/useAuth';
import { EUserRole, Service } from '../../common/services';

export const useLoadUserData = () => {
    const { setUserData, setIsAdmin } = useAuth();

    const load = () => {
        Service.UserService.getUserByToken({ loadInvitedUser: true })
            .then(res => {
                console.log("USER LOADED: ", res.data);
                setUserData(res.data);
                setIsAdmin(res.data.role?.name === EUserRole.ADMIN);
            })
            .catch(err => console.log(err));
    }

    return { load };
};
