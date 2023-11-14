<template>
  <q-page class="q-pl-sm q-pr-sm q-pb-sm">
    <div class="row q-pt-sm">
      <q-breadcrumbs>
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
          ></q-icon>
        </template>
          <q-breadcrumbs-el label="home" icon="home" to="/main" class="text-grey-7"/>
          <q-breadcrumbs-el label="기준정보" icon="info" class="text-grey-7"/>
          <q-breadcrumbs-el label="매출처정보" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="local_shipping" />
        &nbsp;<span>매출처 위치 정보</span>
      </div>
    </div>

    <q-card class="my-card shadow-3" style="height: 800px;">
      <q-card-section>
        <div class="row">
          <div ref="mapDiv" style="width:50%; height:570px;" class="col-lg-5"></div>

          <div ref="roadViewDiv" style="width:50%; height:570px;" class="col-lg-5"></div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item>
            <q-item-section top class="col-2 gt-sm">
              <q-item-label class="q-mt-sm text-weight-bold text-indigo-9">
                거래처명
              </q-item-label>
            </q-item-section>

            <q-item-section top>
              <q-item-label lines="1" class="q-mt-xs text-body2 text-primary text-uppercase">
                <span class="cursor-pointer">
                  {{ partnerList.bpNm }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top class="col-2 gt-sm">
              <q-item-label class="q-mt-sm text-weight-bold text-indigo-9">
                주소
              </q-item-label>
            </q-item-section>

            <q-item-section top>
              <q-item-label lines="1" class="q-mt-xs text-body2 text-primary text-uppercase">
                <span>
                  ( {{ partnerList.postNo }} )
                </span>
                <span class="cursor-pointer">
                  {{ partnerList.bpFullAddr }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <div class="flex flex-center">
          <q-btn
            outline
            color="deep-purple-7"
            label="이전"
            @click="goBack"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from "vue";
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const mapDiv = ref('');
  const roadViewDiv = ref('');
  const bpCd = ref('');
  const partnerList = ref([]);
  const aroundPartnersList = ref([]);

  async function loadData() {
    let aroundRadius = userStore.aroundRadius;

    await axios.get( `/api/v1/partner/location/${bpCd.value}?radius=${aroundRadius}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        partnerList.value = res.data.result.partner;
        aroundPartnersList.value = res.data.result.aroundPartners;

        loadMap()
      } else if( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600
        })
      }
    })
    .catch( error => {
      Notify.create({
        type: 'negative',
        message: 'API를 호출하는 도중 에러가 발생했습니다.',
        timeout: 600
      })
    })
  }

  function loadMap() {
    // 선택한 거래처를 중심좌표로
    var container = mapDiv.value; // 지도를 표시할 div
    var options = {
      center: new kakao.maps.LatLng( partnerList.value.lcLat, partnerList.value.lcLong ),
      level: 3
    }; // 지도 가운데를 선택 거래처로 설정

    let map = new kakao.maps.Map( container, options );

    console.log(roadViewDiv.value)

    // 로드뷰
    let roadview = new kakao.maps.Roadview( roadViewDiv.value );
    let rvClient = new kakao.maps.RoadviewClient();
    let position = new kakao.maps.LatLng( partnerList.value.lcLat, partnerList.value.lcLong );

    rvClient.getNearestPanoId( position, 50, function( panoId ) {
      roadview.setPanoId( panoId, position ); //panoId와 중심좌표를 통해 로드뷰 실행
  });

    // 마커 이미지
    let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    let imageSize = new kakao.maps.Size(24, 35);

    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 선택거래처 마커 생성
    let markerPosition  = new kakao.maps.LatLng(partnerList.value.lcLat, partnerList.value.lcLong);
    let centerMarker = new kakao.maps.Marker({
        map: map,
        position: markerPosition,
        title: partnerList.value.bpNm,
        image : markerImage
    });

    let aroundPartMarkers = [];

    for( let i = 0; i < aroundPartnersList.value.length; i++ ) {
      aroundPartMarkers.push( {
        title: aroundPartnersList.value[i].bpNm,
        latlng: new kakao.maps.LatLng( aroundPartnersList.value[i].lcLat, aroundPartnersList.value[i].lcLong)
      } )
    }

    // 주변 거래처 마커 생성
    for (var i = 0; i < aroundPartMarkers.length; i ++) {
      let aroundMarkers = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: aroundPartMarkers[i].latlng,
          title : aroundPartMarkers[i].title
      });
    }
  }

  function goBack() {
    router.push( {
      path: "/master/info/vehicle",
      state: {
        data : {
          tab : 'vehicleBizPartner'
        }
      }
    })
  }

  onMounted( () => {
    if( history.state.data ) {
      bpCd.value = history.state.data.bpCd;
    }

    loadData()
  })

</script>

