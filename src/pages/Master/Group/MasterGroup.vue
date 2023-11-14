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
          <q-breadcrumbs-el label="조직정보" icon="groups" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="groups" />
        &nbsp;<span>조직정보</span>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-lg-3">
        <q-card class="my-card shadow-3" style="height: 800px;">
          <q-card-section>
            <TuiGrid
              ref="groupTable"
              :options="menuOptions.options"
              :columns="menuOptions.columns"
              :data="menuOptions.data"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-9">
        <div v-if="selected == 'corp'"> <!--선택한 값이 회사일떄-->
          <corp-info
            :menuauth="menuauth"
            :corpId="selectCorpId"
          />
        </div>

        <div v-if="selected == 'logis'"> <!--선택한 값이 물류센터일때-->
          <logis-info
            :menuauth="menuauth"
            :corpId="selectCorpId"
            :lcCd="selectLcCd"
          />
        </div>

        <div v-if="selected == 'org'"> <!--선택한 값이 부서일때-->
          <org-info
            :menuauth="menuauth"
            :corpId="selectCorpId"
            :lcCd="selectLcCd"
            :orgCd="selectOrgCd"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from "vue3-tui-grid";
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar';
  import axios from 'axios';

  import corpInfo from 'src/component/Info/CorporationInfo.vue';
  import LogisInfo from 'src/component/Info/LogisticscenterInfo.vue';
  import OrgInfo from 'src/component/Info/OrganizationInfo.vue';

  const userStore = useUserStore();

  const groupTable = ref('');
  let groupGrid = null;
  let groupInstance = null;

  const selected = ref(''); // 현재 선택된 조직 타입
  const selectCorpId = ref('');
  const selectLcCd = ref('');
  const selectOrgCd = ref('');
  const clickRow = ref('');

  // 현재 메뉴에 대한 권한
  let menu = null;
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  const menuOptions = ref({
    options: {
      treeColumnOptions: {
        name: 'orgNm',
        useIcon: false
      },
      contextMenu: ( { rowKey } ) => (
        [
          [
            {
              name: 'id1',
              label: '등록',
              action: () => {
                groupReg( rowKey )
              }
            },
            {
              name: 'id2',
              label: '하위조직 등록',
              action: () => {
                downGroupReg( rowKey )
              }
            }
          ]
        ]
      ),
    },
    columns: [
      {
        header: '조직명',
        name: 'orgNm',
        minWidth: 200
      },
      {
        header: '조직코드',
        name: 'orgCd'
      },
      {
        header: '회사',
        name: 'corpId',
        hidden: true
      },
      {
        header: '물류센터',
        name: 'lcCd',
        hidden: true
      },
    ],
    data: []
  })

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '조직정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function loadData() {
    axios.get( '/api/v1/corporation/findAllOrganization'
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        groupInstance.resetData( res.data.result );

        // 기본 세팅
        selected.value = 'corp';

        selectCorpId.value = res.data.result[0].orgCd;
      } else if ( res.data.code < 0 ) {
        Notify.create({
            type: 'negative',
            message: res.data.message,
            timeout: 600
          })
      }
    })
  }

  function dtlData( rowKey ) {
    let row = groupInstance.getRow( rowKey );

    if( row.corpId == null && row.lcCd == null ) {
      selected.value = 'corp'

      selectCorpId.value = row.orgCd;
    } else if ( row.corpId != null && row.lcCd == null ) {
      selected.value = 'logis'

      selectCorpId.value = row.corpId;
      selectLcCd.value = row.orgCd;
    } else if ( row.corpId != null && row.lcCd != null ) {
      selected.value = 'org'

      selectCorpId.value = row.corpId;
      selectLcCd.value = row.lcCd;
      selectOrgCd.value = row.orgCd;
    }
  }

  function groupReg( rowKey ) {
    let row = groupInstance.getRow( rowKey );

    if( row.corpId == null && row.lcCd == null ) {
      selected.value = 'corp'

      selectCorpId.value = null;
    } else if ( row.corpId != null && row.lcCd == null ) {
      selected.value = 'logis'

      selectCorpId.value = row.corpId;
      selectLcCd.value = null;
    } else if ( row.corpId != null && row.lcCd != null ) {
      selected.value = 'org'

      selectCorpId.value = row.corpId;
      selectLcCd.value = row.lcCd;
      selectOrgCd.value = null;
    }
  }

  function downGroupReg( rowKey ) {
    let row = groupInstance.getRow( rowKey );

    if( row.corpId == null && row.lcCd == null ) {
      selected.value = 'logis'

      selectCorpId.value = row.orgCd;
      selectLcCd.value = null;
      selectOrgCd.value = null;
    } else if ( row.corpId != null && row.lcCd == null ) {
      selected.value = 'org'

      selectCorpId.value = row.corpId;
      selectLcCd.value = row.orgCd;
      selectOrgCd.value = null;
    } else if ( row.corpId != null && row.lcCd != null ) {
      console.log("aa")
      Notify.create({
        type: 'negative',
        message: '부서의 하위조직은 등록이 불가합니다.',
        timeout: 600
      })
    }
  }

  onMounted( () => {
    selectMenuAuth()
    loadData()

    groupGrid = groupTable.value;
    groupInstance = groupGrid.gridInstance;

    groupGrid.applyTheme( 'clean' );
    groupInstance.setBodyHeight( 720 );

    groupInstance.on( 'click', ( ev ) => {
      if( ev.targetType == 'cell' ) {
        dtlData( ev.rowKey )

        if( clickRow.value == ev.rowKey ) {
          groupInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );
          clickRow.value = null;
          return;
        }

        clickRow.value = ev.rowKey;

        for( let i = 0; i<groupInstance.getRowCount(); i++ ) {
          groupInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        groupInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })
  })
</script>
