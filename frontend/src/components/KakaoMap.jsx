import React, { useEffect, useRef } from "react";

const KakaoMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=6d5d02bdfce3aa56d32fcf629db2fcd4&autoload=false`;

    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);

        const markerPosition = new window.kakao.maps.LatLng(
          33.450701,
          126.570667
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        marker.setMap(map);

        const iwContent =
          '<div style="padding:5px;">Hello World! <br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>';

        const iwPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);

        const infowindow = new window.kakao.maps.InfoWindow({
          position: iwPosition,
          content: iwContent,
        });

        infowindow.open(map, marker);
      });
    });

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div ref={mapContainer} style={{ width: "500px", height: "400px" }}></div>
  );
};

export default KakaoMap;
