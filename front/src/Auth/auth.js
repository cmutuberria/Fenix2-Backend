
// export const userAuth = useSelector(state => userAuthenticated(state));
export const hasPermition=(roles, userRoles)=> {
        let permitido=false;
        if (roles && roles.length > 0) {
            if(userRoles&&userRoles.length > 0){
                roles.map((rol)=>{
                    if(userRoles.includes(rol)){
                        permitido=true;
                    }
                })
            }
        }else{
            permitido=true;
        }
        return permitido;
    }
