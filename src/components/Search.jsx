import { useContext, useState } from "react";
import { collection,
query,
where,
getDocs,
setDoc,
updateDoc,
doc,
serverTimestamp, 
getDoc} from "firebase/firestore";
import {db} from '../firebase';
import {AuthContext} from '../context/AuthContext';

const Search = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const handleKey = (e) => {
    (e.code === 'Enter' || e.code === 'NumpadEnter') && handleSearch();
  }

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where("displayName", "==", search));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      console.log('error :>> ', error);
      setError(true);
    }
  }

  const handleSelect = async () => {
    // check if group exists or not in firestore. if not, create group
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      
      if (!res.exists()) {
        // create chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), {
          messages: []
        })
         //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
    }

    setUser(null);
    setSearch("");
  }
  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find a User'
          onChange={e => setSearch(e.target.value)}
          onKeyUp={handleKey}
          value={search}
        />
      </div>
      {error && <p className='error'>User not found</p>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user?.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user?.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search