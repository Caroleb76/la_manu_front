import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { ADMIN_ROLE, FORMATEUR_ROLE, SUPERADMIN_ROLE, TOKEN_KEY } from "../src/utils/constants";
import { authMe } from "../src/helpers/auth";
import { handleNameInitials } from "../src/utils/initials";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const init = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token && !user) {
          const raw = await authMe(); 
          updateUser(raw);
        }
      } catch (error) {
        console.error(error);
        signout();
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    init();
    return () => { mountedRef.current = false; };

  }, []); 


function normalizeUser(u) {
  const firstName = u?.firstName ?? "";
  const lastName  = u?.lastName  ?? "";
  return {
    ...u,
    initials: u?.initials ?? handleNameInitials(`${firstName} ${lastName}`),
    isAdmin: [ADMIN_ROLE, SUPERADMIN_ROLE].includes(u?.role?.name),
    isFormateur: u?.role?.name === FORMATEUR_ROLE
  };
}

function updateUser(patch) {
    console.log("updating user" , patch);
    if (!patch) return;
    console.log("updating user" , user?.profilePicVersion);
  
  setUser(prev => {
    if (!prev) {
      const next = normalizeUser(patch);
      next.profilePicVersion = next.profilePicture ? 1 : 0;
      return next;
    }

    const photoChanged =
      patch.profilePicture && patch.profilePicture !== prev.profilePicture;

    const merged = normalizeUser({ ...prev, ...patch });

    return {
      ...merged,
      profilePicVersion: photoChanged
        ? (prev.profilePicVersion ?? 0) + 1
        : (prev.profilePicVersion ?? 0),
    };
  });
}


  function signout() {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  const value = useMemo(() => ({ user, updateUser, signout, loading }), [user, loading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
