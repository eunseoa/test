const setCss = () => import( 'src/SETCSS.vue' );

const DashBoard = () => import( 'src/pages/DashBoard.vue' ); // 대시보드
const Notice = () => import( 'pages/Board/Notice.vue' ); // 공지사항
const NoticeDetail = () => import( 'pages/Board/NoticeDetail.vue' ); // 공지사항 상세정보
const CodeList = () => import( 'pages/Preferences/CodeList.vue' ); // 공통코드 관리
const Mypage = () => import( 'pages/User/MyPage.vue' ); // 내정보
const SystemMenu = () => import( 'src/pages/Preferences/env/SystemMenu.vue' ); // 시스템 메뉴관리
const SystemEnvConfig = () => import( 'src/pages/Preferences/env/SystemEnvConfig.vue' ); // 시스템 환경설정
const SystemCorpor = () => import( 'src/pages/Preferences/env/SystemCorporation.vue' ); // 회사정보관리
const MasterCommomCdoe = () => import( 'src/pages/Master/Code/MasterCommomCode.vue' ); // 공통코드관리
const MasterLogisticsCenter = () => import( 'src/pages/Master/Logis/MasterLogisticscenter.vue' ); // 물류센터정보
const MasterGroup = () => import('src/pages/Master/Group/MasterGroup.vue'); //조직정보
const MasterBrand = () => import( 'src/pages/Master/Brand/MasterBrand.vue' ); // 브랜드정보
const MasterEmployee = () => import( 'src/pages/Master/Employee/MasterEmployee.vue'); // 직원정보
const MasterVehicle = () => import( 'src/pages/Master/Vehicle/MasterVehicle.vue'); // 배송차량정보
const MasterbPInfoByVehicle = () => import( 'src/pages/Master/Vehicle/MasterBpInfoByVehicle.vue' ); // 거래처 상세
const MasterbPMapByVehicle = () => import( 'src/pages/Master/Vehicle/MasterBpMapByVehicle.vue' ); // 거래처 지도
const MasterVendor = () => import( 'src/pages/Master/Vendor/MasterVendor.vue' ); // 매입처관리
const MasterVendorAdd = () => import( 'src/pages/Master/Vendor/MasterVendorAdd.vue' ); // 매입처관리 등록
const MasterVendorMod = () => import( 'src/pages/Master/Vendor/MasterVendorMod.vue' ); // 매입처관리 수정
const MasterVendorUpload = () => import( 'src/pages/Master/Vendor/MasterVendorUpload.vue' ); // 매입처관리 일괄등록

const MasterStroe = () => import( 'src/pages/Master/Store/MasterStore.vue' ); // 매출처 관리

const SecurityAccount = () => import( 'src/pages/Preferences/security/SystemSecurityAccount.vue' ); // 사용자
const SecurityAccountDtl = () => import( 'src/pages/Preferences/security/SystemSecurityAccountDtl.vue' ); // 사용자 정보
const SecurityGroup = () => import( 'src/pages/Preferences/security/SystemSecurityGroup.vue' ); // 사용자 정보

const AdminCorpAnnounce = () => import( 'src/pages/Preferences/board/AdminCorpAnnounce.vue' ); // 사내 공지사항 관리
const AdminCorpAnnounceMod = () => import( 'src/pages/Preferences/board/AdminCorpAnnounceMod.vue' ); // 사내 공지사항 상세
const AdminCorpAnnounceAdd = () => import( 'src/pages/Preferences/board/AdminCorpAnnounceAdd.vue' ); // 사내 공지사항 등록

const UserCorpAnnounce = () => import( 'src/pages/User/board/UserCorpAnnounce.vue' ); // 사내 공지사항
const UserCorpAnnounceDtl = () => import( 'src/pages/User/board/UserCorpAnnounceDtl.vue' ); // 사내 공지사항 상세

const routes = [
  {
    path: '/',
    component: () => import( 'layouts/Layout.vue' ),
    redirect: '/main',
    children: [
      { path: 'css', component: setCss },
      { path: 'main', component: DashBoard, meta: { required: true } },
      { path: '/board/notice', component: Notice },
      { path: 'noticeDetail', component: NoticeDetail },
      { path: 'code', component: CodeList },
      { path: 'mypage', component: Mypage },
      { path: 'DaumAPI', component: () => import( 'pages/DaumAPI.vue' ) },
      { path: '/system/env/menu', component: SystemMenu },
      { path: '/system/sysconfig', component: SystemEnvConfig },
      { path: '/system/env/corporation', component: SystemCorpor },
      { path: '/master/info/commoncode', component: MasterCommomCdoe },
      { path: '/master/info/logisticscenter', component: MasterLogisticsCenter },
      { path: '/master/info/group', component: MasterGroup },
      { path: '/master/info/brand', component: MasterBrand },
      { path: '/master/info/employee', component: MasterEmployee },
      { path: '/master/info/vehicle', component: MasterVehicle },
      { path: '/master/info/vehicle/bizPartner', component: MasterbPInfoByVehicle },
      { path: '/master/info/vehicle/bizPartnerMap', component: MasterbPMapByVehicle },
      { path: '/master/info/vendor', component: MasterVendor },
      { path: '/master/info/vendoradd', component: MasterVendorAdd },
      { path: '/master/info/vendormod', component: MasterVendorMod },
      { path: '/master/info/vendorupload', component: MasterVendorUpload },
      { path: '/master/info/store', component: MasterStroe },
      { path: '/system/security/account', component: SecurityAccount },
      { path: '/system/security/accountDtl', component: SecurityAccountDtl },
      { path: '/system/security/group', component: SecurityGroup },
      { path: '/system/board/corpAnnounce', component: AdminCorpAnnounce },
      { path: '/system/board/corpAnnounceMod', component: AdminCorpAnnounceMod },
      { path: '/system/board/corpAnnounceReg', component: AdminCorpAnnounceAdd },
      { path: '/user/board/corpAnnounce', component: UserCorpAnnounce },
      { path: '/user/board/corpAnnounceDtl', component: UserCorpAnnounceDtl }
    ]
  },

  {
    path: '/login',
    component: () => import( 'pages/User/Login.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import( 'pages/error/404.vue')
  },
  {
    path: '/500',
    component: () => import( 'pages/error/500.vue')
  },
  {
    path: '/privacy',
    component: () => import( 'pages/User/Privacy.vue')
  },
]

export default routes
