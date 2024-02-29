import AppContext from "@/context/AppContext";
import { db } from "@/firebase";
import { Data } from "@/types";
import { CollectionReference, Query, QueryConstraint, collection, getCountFromServer, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

type useRankProps = {
  params:{
    id:string
  };
}

const useRank = ({params}:useRankProps) => {
  const [datas, setDatas] = useState<Data[]>([]);
  const [count, setCount] = useState<number>();
  const itemsPerPage = 50;
  const [itemsOffSet, setItemsOffSet] = useState<number>(0);

  useEffect(() => {
    const fetchRanks = async () => {
      const rankCollectionRef = collection(db, "ranks");
      let q;
      if (params.id) {
        q = query(rankCollectionRef, where("characterName", "==", params.id), orderBy("power", "desc"));
      } else {
        q = query(rankCollectionRef, orderBy("power", "desc"));
      }
      const rankCount = await getCountFromServer(rankCollectionRef);
      const newCount = rankCount.data().count;
      setCount(newCount);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRank = snapshot.docs.map((doc) => doc.data() as Data)
        setDatas(newRank);
      });
      return () => {
        unsubscribe();
      };
    };
    fetchRanks();
  }, []);

  const getIndex = (value: number, arr: Data[]): number => {
    return arr.findIndex(item => item.power === value);
  };

  const handlePageClick = (event: { selected: number; }) => {
    const newOffset = (event.selected * itemsPerPage) % datas.length;
    setItemsOffSet(newOffset);
  };

  return { itemsPerPage,datas, count, itemsOffSet, getIndex, handlePageClick };
}

export default useRank;