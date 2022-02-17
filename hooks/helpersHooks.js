const useTime = () => {
  const convertUTCToLocalTime = (dateString) => {
    const year = dateString.slice(2, 4);
    const month = dateString.slice(5, 7);
    const day = dateString.slice(8, 10);
    const hour = dateString.slice(11, 13);
    const minute = dateString.slice(14, 16);

    return `${day}-${month}-${year} ${hour}:${minute}`;
  };
  return {convertUTCToLocalTime};
};

export {useTime};
