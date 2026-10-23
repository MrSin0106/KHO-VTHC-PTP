
// --- QUẢN LÝ DỮ LIỆU & CẤU HÌNH ---
const SYSTEM_APP_VERSION = 'v1.2';
const MOCK_STORAGE_KEY = 'LAB_INVENTORY_MOCK_V5';
const CONFIG_STORAGE_KEY = 'LAB_INVENTORY_CONFIG_V5';

// Tự động đồng bộ phiên bản lên giao diện người dùng
function syncAppVersionUI() {
  const v = SYSTEM_APP_VERSION || 'v1.2';
  const titleVerEl = document.getElementById('navbar-app-version');
  if (titleVerEl) titleVerEl.textContent = `Quản lý hóa chất & vật tư thí nghiệm - ${v}`;
  const badgeBtn = document.getElementById('changelog-badge-btn');
  if (badgeBtn) badgeBtn.innerHTML = `✨ Bản mới (${v})`;
  const modalTag = document.getElementById('changelog-version-tag');
  if (modalTag) modalTag.textContent = v;
}

const DEFAULT_CONFIGS = {
  brands: ['VN', 'Glassco', 'Merck', 'Sigma-Aldrich', 'Xilong', 'Scharlau', 'Đức', 'USA'],
  specs: ['Cái', 'Hộp', 'Kg', 'kg', 'Cuộn', '3 cuộn/lốc', 'Đôi'],
  recipients: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phòng Hóa Hữu Cơ', 'Phòng Vi Sinh'],
  purposes: ['Nhiệm vụ nghiên cứu đề tài', 'Dịch vụ phân tích mẫu', 'Hao hụt định kỳ', 'Kiểm tra chất lượng (QC)'],
  locations: ['Tủ A', 'Tủ B', 'Tủ C', 'Tủ D', 'Kho A', 'Kho B', 'Tủ mát 4°C', 'Tủ đông -20°C', 'Kệ 1', 'Kệ 2'],
  sharedLocations: ['Tủ dùng chung A', 'Tủ dùng chung B', 'Tủ hút', 'Tủ lạnh 4°C', 'Kệ chung 1'],
  apiUrl: '', 
  supabaseUrl: 'https://mbjyybqguvlnjtqyvmni.supabase.co',
  supabaseKey: 'sb_publishable_mVxdko-USJ_BF_M2sYfrFQ_0lgfxAnA',
  adminPin: '1234',
  importerPin: '2222',
  exporterPin: '3333',
  staffPin: '1111',
  showAdminExportTab: false,
  showAdminImportTab: false,
  showAdminCartTab: false,
  APP_TITLE: "Kho VTHC Phòng CNSH Thực phẩm",
  APP_VERSION: "v1.2",
  labOrgName: "HỆ THỐNG QUẢN LÝ PHÒNG THÍ NGHIỆM",
  labRoomName: "Phòng Thí Nghiệm CNSH Thực Phẩm",
  exporterName: "Người xuất kho",
  TAB_NAME_INVENTORY: "Tồn Kho",
  TAB_NAME_EXPORT: "Duyệt & Xuất",
  TAB_NAME_IMPORT: "Nhập Kho",
  TAB_NAME_HISTORY: "Nhật Ký",
  TAB_NAME_DASHBOARD: "Biểu Đồ",
  customFields: []
};

// Dữ liệu ban đầu mô phỏng file Excel có sẵn lịch sử giả lập để trực quan hơn
const INITIAL_MOCK_DATA = {
  inventory: [
    { ID: 'VT2', Ma_So: 'TPVT-B1', Ten: 'Bấc đèn cồn', Hang: 'Glassco', Quy_Cach: 'cái', Noi_Bao_Quan: 'tủ D1', So_Luong: 3, Don_Vi: 'cái', Han_Su_Dung: '', Nam_Nhap: '2020', Ghi_Chu: '' },
    { ID: 'VT3', Ma_So: 'TPVT-B2', Ten: 'Bản sắc ký TLC Silica gel 60', Hang: 'Merck', Quy_Cach: 'Hộp', Noi_Bao_Quan: 'Kho B', So_Luong: 2, Don_Vi: 'Hộp', Han_Su_Dung: '', Nam_Nhap: '2021', Ghi_Chu: '' },
    { ID: 'VT5', Ma_So: 'TPVT-B3', Ten: 'Bao hấp 30x50 cm', Hang: 'VN', Quy_Cach: 'kg', Noi_Bao_Quan: 'Kho A', So_Luong: 5, Don_Vi: 'kg', Han_Su_Dung: '', Nam_Nhap: '2019', Ghi_Chu: '' },
    { ID: 'VT6', Ma_So: 'TPVT-B4', Ten: 'Bao rác', Hang: '', Quy_Cach: 'Cuộn', Noi_Bao_Quan: 'Kho B', So_Luong: 80, Don_Vi: 'Cuộn', Han_Su_Dung: '', Nam_Nhap: '2023', Ghi_Chu: '' },
    { ID: 'VT7', Ma_So: 'TPVT-B4', Ten: 'Bao rác 3 cuộn màu loại đại', Hang: '', Quy_Cach: '3 cuộn/lốc', Noi_Bao_Quan: 'Kho B', So_Luong: 10, Don_Vi: 'lốc', Han_Su_Dung: '', Nam_Nhap: '2020', Ghi_Chu: '' },
    { ID: 'VT8', Ma_So: 'TPVT-B5', Ten: 'Bao tay cao su dày', Hang: '', Quy_Cach: 'Đôi', Noi_Bao_Quan: 'Kho B', So_Luong: 14, Don_Vi: 'Đôi', Han_Su_Dung: '', Nam_Nhap: '2024', Ghi_Chu: '' },
    { ID: 'VT9', Ma_So: 'TPVT-B8', Ten: 'Becher 100 mL', Hang: 'Đức', Quy_Cach: 'Cái', Noi_Bao_Quan: 'Kho B', So_Luong: 20, Don_Vi: 'Cái', Han_Su_Dung: '', Nam_Nhap: '', Ghi_Chu: '' }
  ],
  imports: [
    { ID_Giao_Dich: 'NK0001', ID_Vat_Tu: 'VT3', Ten: 'Bản sắc ký TLC Silica gel 60', Hang: 'Merck', Quy_Cach: 'Hộp', So_Luong: 2, Don_Vi: 'Hộp', Ngay_Nhap: '2026-06-01T08:30:00.000Z', Nguoi_Nhap: 'Admin', Ghi_Chu: 'Nạp ban đầu' }
  ],
  exports: [
    { ID_Giao_Dich: 'XK0001', ID_Vat_Tu: 'VT2', Ten: 'Bấc đèn cồn', Hang: 'Glassco', Quy_Cach: 'cái', So_Luong: 1, Don_Vi: 'cái', Ngay_Xuat: '2026-06-02T10:15:00.000Z', Nguoi_Nhan: 'Nguyễn Văn A', Muc_Dich: 'Dịch vụ phân tích mẫu', Nguoi_Xuat: 'Admin', Ghi_Chu: 'Cấp nhanh' }
  ],
  requests: [
    { ID_Yeu_Cau: 'YC0001', ID_Vat_Tu: 'VT5', Ten: 'Bao hấp 30x50 cm', Hang: 'VN', Quy_Cach: 'kg', So_Luong_Yeu_Cau: 2, Don_Vi: 'kg', Nguoi_Yeu_Cau: 'Trần Thị B', Muc_Dich: 'Nhiệm vụ nghiên cứu đề tài', Ngay_Yeu_Cau: '2026-06-03T14:00:00.000Z', Trang_Thai: 'Cho_Duyet', Ghi_Chu: 'Cần gấp cho thí nghiệm hữu cơ' }
  ],
  editLogs: [
    { ID_Log: 'EDIT001', ID_Vat_Tu: 'VT6', Ten_Vat_Tu: 'Bao rác', Noi_Dung_Thay_Doi: 'Số lượng tồn: [50] -> [80]', Ngay_Chinh_Sua: '2026-06-04T09:00:00.000Z', Nguoi_Chinh_Sua: 'Admin' }
  ],
  sharedCabinet: [
    {
      id: 'SC_001',
      id_vat_tu: '',
      ten: 'HNO3 65%',
      hang: 'Sigma-Aldrich',
      quy_cach: '500 g',
      don_vi: 'Chai',
      vi_tri_tu: 'Tủ dùng chung A',
      so_luong: 1,
      khoi_luong_con_lai: '300 g',
      tinh_trang: 'active',
      ngay_tao: '2026-10-22T08:00:00.000Z',
      ngay_cap_nhat: '2026-10-22T10:30:00.000Z',
      nguoi_dua_vao: 'Người nhập kho',
      nguoi_cap_nhat: 'Sinh viên Tú',
      ghi_chu: 'Dùng làm đề tài QC, còn ~300g cho sinh viên dùng chung'
    },
    {
      id: 'SC_002',
      id_vat_tu: '',
      ten: 'NaOH hạt tinh khiết',
      hang: 'Xilong',
      quy_cach: '500 g',
      don_vi: 'Chai',
      vi_tri_tu: 'Tủ dùng chung B',
      so_luong: 1,
      khoi_luong_con_lai: '200 g',
      tinh_trang: 'active',
      ngay_tao: '2026-10-21T09:00:00.000Z',
      ngay_cap_nhat: '2026-10-22T14:00:00.000Z',
      nguoi_dua_vao: 'Người nhập kho',
      nguoi_cap_nhat: 'Nhân viên Lab',
      ghi_chu: 'Để tại Tủ B cho các bài thực hành'
    }
  ]
};

let appData = null;
let appConfig = null;
let currentRole = 'staff'; 
let cart = JSON.parse(localStorage.getItem('LAB_EXPORT_CART') || '[]');
let importCart = JSON.parse(localStorage.getItem('LAB_IMPORT_CART_V5') || '[]');
let searchQuery = ''; // Lưu từ khóa tìm kiếm toàn cục để lọc trước khi render
let selectedLocationFilter = ''; // Lưu bộ lọc vị trí kho toàn cục

function saveCart() {
  localStorage.setItem('LAB_EXPORT_CART', JSON.stringify(cart));
}

function groupRequests(reqs) {
  const sorted = [...(reqs || [])].sort((a, b) => new Date(a.Ngay_Yeu_Cau).getTime() - new Date(b.Ngay_Yeu_Cau).getTime());
  const groups = [];
  
  sorted.forEach(req => {
    const reqTime = new Date(req.Ngay_Yeu_Cau).getTime();
    // Gộp các yêu cầu xuất kho của cùng 1 người gửi cách nhau dưới 15 giây
    const match = groups.find(g => 
      g.Nguoi_Yeu_Cau === req.Nguoi_Yeu_Cau &&
      g.Muc_Dich === req.Muc_Dich &&
      g.Trang_Thai === req.Trang_Thai &&
      Math.abs(new Date(g.Ngay_Yeu_Cau).getTime() - reqTime) <= 15000
    );
    
    if (match) {
      match.items.push(req);
    } else {
      groups.push({
        Ngay_Yeu_Cau: req.Ngay_Yeu_Cau,
        Nguoi_Yeu_Cau: req.Nguoi_Yeu_Cau,
        Muc_Dich: req.Muc_Dich,
        Ghi_Chu: req.Ghi_Chu,
        Trang_Thai: req.Trang_Thai,
        Ly_Do_Tu_Choi: req.Ly_Do_Tu_Choi || '',
        items: [req]
      });
    }
  });
  return groups;
}

function groupExports(exports) {
  const sorted = [...(exports || [])].sort((a, b) => new Date(a.Ngay_Xuat).getTime() - new Date(b.Ngay_Xuat).getTime());
  const groups = [];
  
  sorted.forEach(exp => {
    const expTime = new Date(exp.Ngay_Xuat).getTime();
    // Gộp các giao dịch xuất kho của cùng 1 người nhận cách nhau dưới 15 giây
    const match = groups.find(g => 
      g.Nguoi_Nhan === exp.Nguoi_Nhan &&
      g.Muc_Dich === exp.Muc_Dich &&
      g.Nguoi_Xuat === exp.Nguoi_Xuat &&
      Math.abs(new Date(g.Ngay_Xuat).getTime() - expTime) <= 15000
    );
    
    if (match) {
      match.items.push(exp);
    } else {
      groups.push({
        Ngay_Xuat: exp.Ngay_Xuat,
        Nguoi_Nhan: exp.Nguoi_Nhan,
        Muc_Dich: exp.Muc_Dich,
        Nguoi_Xuat: exp.Nguoi_Xuat,
        Ghi_Chu: exp.Ghi_Chu,
        items: [exp]
      });
    }
  });
  return groups;
}

function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
  return str.toLowerCase().trim();
}

function getPinForRole(role) {
  if (role === 'admin') return appConfig.adminPin || '1234';
  if (role === 'importer') return appConfig.importerPin || '2222';
  if (role === 'exporter') return appConfig.exporterPin || '3333';
  if (role === 'staff') return appConfig.staffPin || '1111';
  if (role === 'student') return appConfig.studentPin || '0';
  return '';
}

function checkUserSession() {
  const remember = localStorage.getItem('LAB_SESSION_REMEMBER') === 'true';
  const role = localStorage.getItem('LAB_SESSION_ROLE');
  const savedPin = localStorage.getItem('LAB_SESSION_PIN');
  const loginTime = parseInt(localStorage.getItem('LAB_SESSION_TIME') || '0', 10);
  
  if (remember && role && savedPin && loginTime) {
    const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - loginTime < oneMonthMs) {
      const currentPin = getPinForRole(role).toString().trim();
      const adminPin = (appConfig.adminPin || '1234').toString().trim();
      const savedPinStr = savedPin.toString().trim();
      if (savedPinStr === currentPin || savedPinStr === adminPin) {
        currentRole = role;
        return true;
      }
    }
  }
  
  const sRole = sessionStorage.getItem('LAB_SESSION_ROLE');
  const sSavedPin = sessionStorage.getItem('LAB_SESSION_PIN');
  if (sRole && sSavedPin) {
    const currentPin = getPinForRole(sRole).toString().trim();
    const adminPin = (appConfig.adminPin || '1234').toString().trim();
    const sSavedPinStr = sSavedPin.toString().trim();
    if (sSavedPinStr === currentPin || sSavedPinStr === adminPin) {
      currentRole = sRole;
      return true;
    }
  }
  
  return false;
}

function showLoginScreen(show) {
  const loginContainer = document.getElementById('login-container');
  const navbar = document.querySelector('.navbar');
  const container = document.querySelector('.container');
  const mobileNav = document.querySelector('.mobile-bottom-nav');
  
  if (show) {
    if (loginContainer) loginContainer.style.display = 'block';
    if (navbar) navbar.style.display = 'none';
    if (container) container.style.display = 'none';
    if (mobileNav) mobileNav.style.display = 'none';
    
    const passInput = document.getElementById('login-password');
    if (passInput) passInput.value = '';
  } else {
    if (loginContainer) loginContainer.style.display = 'none';
    if (navbar) navbar.style.display = 'flex';
    if (container) container.style.display = 'block';
    if (mobileNav) {
      if (window.innerWidth <= 768) {
        mobileNav.style.display = 'flex';
      } else {
        mobileNav.style.display = 'none';
      }
    }
  }
}

let supabaseClient = null;
function initSupabase() {
  try {
    const url = appConfig.supabaseUrl || '';
    const key = appConfig.supabaseKey || '';
    if (url && key && window.supabase) {
      supabaseClient = window.supabase.createClient(url, key);
    } else {
      supabaseClient = null;
    }
  } catch (err) {
    console.error('Lỗi khởi tạo Supabase:', err);
    supabaseClient = null;
  }
}

function init() {
  const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
  appConfig = savedConfig ? JSON.parse(savedConfig) : { ...DEFAULT_CONFIGS };
  if (!appConfig.customFields) appConfig.customFields = [];
  if (!appConfig.supabaseUrl) appConfig.supabaseUrl = DEFAULT_CONFIGS.supabaseUrl;
  if (!appConfig.supabaseKey) appConfig.supabaseKey = DEFAULT_CONFIGS.supabaseKey;
  initSupabase();
  
  if (!appConfig.staffPin) {
    appConfig.staffPin = '1111';
  }
  if (!appConfig.studentPin) {
    appConfig.studentPin = '0';
  }
  if (!appConfig.permissions) {
    appConfig.permissions = {
      staff: { code: false, name: false, brand: false, spec: false, location: false, qty: false, expiry: false, unit: false, year: false, note: false, delete: false },
      student: { code: false, name: false, brand: false, spec: false, location: false, qty: false, expiry: false, unit: false, year: false, note: false, delete: false },
      importer: { code: true, name: true, brand: true, spec: true, location: true, qty: true, expiry: true, unit: true, year: true, note: true, delete: false },
      exporter: { code: true, name: true, brand: true, spec: true, location: true, qty: true, expiry: true, unit: true, year: true, note: true, delete: false }
    };
  } else {
    if (!appConfig.permissions.student) {
      appConfig.permissions.student = { code: false, name: false, brand: false, spec: false, location: false, qty: false, expiry: false, unit: false, year: false, note: false, delete: false };
    }
    ['staff', 'student', 'importer', 'exporter'].forEach(role => {
      if (appConfig.permissions[role] && appConfig.permissions[role].delete === undefined) {
        appConfig.permissions[role].delete = false;
      }
    });
  }

  if (window.location.href.includes('script.google.com') && (!appConfig.apiUrl || !appConfig.apiUrl.includes('script.google.com'))) {
    appConfig.apiUrl = window.location.href.split('?')[0].split('#')[0];
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  }
  
  if (!savedConfig) {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  }

  const hasSession = checkUserSession();
  
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  applyAppConfigUI();
  setupEventListeners();
  renderDynamicCustomFieldInputs();

  if (hasSession) {
    showLoginScreen(false);
    loadData();
    updateNavigationByRole();
    initSilentPolling();
    checkChangelogOnStartup();
  } else {
    showLoginScreen(true);
  }
}

// Hàm gửi request đa nền tảng (tự động dùng google.script.run khi chạy trực tiếp trên Google Apps Script)
async function sendRequest(payload) {
  initSupabase();
  if (supabaseClient) {
    // 1. Save Config
    if (payload.action === 'save_config') {
      const { error } = await supabaseClient.from('cau_hinh').upsert({ key: 'config', value: JSON.stringify(payload.config) });
      if (error) throw error;
      return { success: true };
    }
    
    // 2. Bulk Import
    if (payload.action === 'bulk_import') {
      for (const rawItem of payload.items) {
        const { data: existing } = await supabaseClient.from('kho_vat_tu')
          .select('*')
          .eq('ten', rawItem.name)
          .eq('hang', rawItem.brand || '')
          .eq('quy_cach', rawItem.spec || '')
          .maybeSingle();

        let itemId = rawItem.itemId || rawItem.id;
        if (existing) {
          itemId = existing.id;
          const newQty = (parseFloat(existing.so_luong) || 0) + (parseFloat(rawItem.qty) || 0);
          const { error } = await supabaseClient.from('kho_vat_tu').update({
            so_luong: newQty,
            ma_so: rawItem.code || existing.ma_so,
            noi_bao_quan: rawItem.location || existing.noi_bao_quan,
            don_vi: rawItem.unit || existing.don_vi,
            han_su_dung: rawItem.expiry || existing.han_su_dung,
            nam_nhap: rawItem.importYear || existing.nam_nhap,
            ghi_chu: rawItem.note || existing.ghi_chu,
            dac_tinh_ky_thuat: rawItem.techSpecs || existing.dac_tinh_ky_thuat
          }).eq('id', itemId);
          if (error) throw error;
        } else {
          if (!itemId) {
            itemId = 'VT' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
          }
          const { error } = await supabaseClient.from('kho_vat_tu').insert({
            id: itemId,
            ma_so: rawItem.code,
            ten: rawItem.name,
            hang: rawItem.brand || '',
            quy_cach: rawItem.spec || '',
            noi_bao_quan: rawItem.location,
            so_luong: rawItem.qty,
            don_vi: rawItem.unit || 'Cái',
            han_su_dung: rawItem.expiry,
            nam_nhap: rawItem.importYear,
            ghi_chu: rawItem.note,
            dac_tinh_ky_thuat: rawItem.techSpecs || ''
          });
          if (error) throw error;
        }

        // Log imports
        const importId = 'NK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
        const userRoleStr = currentRole === 'admin' ? 'Admin' : 'Người nhập kho';
        const { error: impErr } = await supabaseClient.from('lich_su_nhap').insert({
          id_giao_dich: importId,
          id_vat_tu: itemId,
          ten: rawItem.name,
          hang: rawItem.brand || '',
          quy_cach: rawItem.spec || '',
          so_luong: rawItem.qty,
          don_vi: rawItem.unit,
          ngay_nhap: new Date().toISOString(),
          nguoi_nhap: userRoleStr,
          ghi_chu: rawItem.note
        });
        if (impErr) throw impErr;
      }
      return { success: true };
    }
    
    // 3. Request Export (Yêu cầu xuất kho)
    if (payload.action === 'request_export' || payload.action === 'bulk_request_export') {
      const items = payload.items || [payload];
      const recipient = payload.recipient;
      const purpose = payload.purpose;
      const note = payload.note;
      const dateStr = payload.date || new Date().toISOString();
      
      for (let k = 0; k < items.length; k++) {
        const rawItem = items[k];
        const requestId = "YC" + Date.now() + Math.floor(Math.random() * 100) + k;
        const { error } = await supabaseClient.from('yeu_cau_xuat').insert({
          id_yeu_cau: requestId,
          id_vat_tu: rawItem.itemId,
          ten: rawItem.name,
          hang: rawItem.brand || '',
          quy_cach: rawItem.spec || '',
          so_luong_yeu_cau: rawItem.qty,
          don_vi: rawItem.unit || 'Cái',
          nguoi_yeu_cau: recipient,
          muc_dich: purpose,
          ngay_yeu_cau: dateStr,
          trang_thai: 'Cho_Duyet',
          ghi_chu: note
        });
        if (error) throw error;
      }
      return { success: true };
    }
    
    // 4. Approve Export (Duyệt xuất kho)
    if (payload.action === 'approve_export') {
      const { data: req, error: reqErr } = await supabaseClient.from('yeu_cau_xuat').select('*').eq('id_yeu_cau', payload.requestId).single();
      if (reqErr) throw reqErr;
      
      let itemId = req.id_vat_tu;
      let name = req.ten;
      let brand = req.hang;
      let spec = req.quy_cach;
      let unit = req.don_vi;
      
      let isReplaced = false;
      let note = payload.note || '';
      if (payload.replacementItemId) {
        const { data: rep, error: repErr } = await supabaseClient.from('kho_vat_tu').select('*').eq('id', payload.replacementItemId).single();
        if (repErr) throw repErr;
        itemId = rep.id;
        name = rep.ten;
        brand = rep.hang;
        spec = rep.quy_cach;
        unit = rep.don_vi;
        isReplaced = true;
        
        const replacementNote = `Thay thế từ: ${req.ten} (${req.hang})`;
        note = note ? `${replacementNote}. ${note}` : replacementNote;
      }
      
      const approvedQty = parseFloat(payload.qty);
      let updatedSuccess = false;

      // 1. Thử gọi RPC atomic transaction nếu đã tạo trên Supabase
      try {
        const { data: rpcRes, error: rpcErr } = await supabaseClient.rpc('deduct_inventory', {
          p_item_id: itemId,
          p_deduct_qty: approvedQty
        });
        if (!rpcErr && rpcRes && rpcRes.success) {
          updatedSuccess = true;
        }
      } catch(e) {}

      // 2. Chống Race Condition: Đọc lại dữ liệu mới nhất (fresh read) trực tiếp từ database
      if (!updatedSuccess) {
        const { data: inv, error: invErr } = await supabaseClient
          .from('kho_vat_tu')
          .select('id, ten, so_luong')
          .eq('id', itemId)
          .single();
        if (invErr) throw invErr;
        
        const freshQty = parseFloat(inv.so_luong) || 0;
        if (freshQty < approvedQty) {
          throw new Error(`Tồn kho của "${inv.ten}" không đủ duyệt! (Tồn thực tế hiện có: ${freshQty}, yêu cầu duyệt: ${approvedQty})`);
        }
        
        const newQty = Math.max(0, Math.round((freshQty - approvedQty) * 1000) / 1000);
        const { error: updErr } = await supabaseClient
          .from('kho_vat_tu')
          .update({ so_luong: newQty })
          .eq('id', itemId);
        if (updErr) throw updErr;
      }
      
      const exportId = "XK" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const userRole = currentRole === 'admin' ? "Admin" : (currentRole === 'importer' ? "Người nhập kho" : "Người xuất kho");
      const { error: expLogErr } = await supabaseClient.from('lich_su_xuat').insert({
        id_giao_dich: exportId,
        id_vat_tu: itemId,
        ten: name,
        hang: brand || '',
        quy_cach: spec || '',
        so_luong: approvedQty,
        don_vi: unit,
        ngay_xuat: new Date().toISOString(),
        nguoi_nhan: req.nguoi_yeu_cau,
        muc_dich: payload.purpose || req.muc_dich,
        nguoi_xuat: userRole,
        ghi_chu: `Duyệt từ yêu cầu ${payload.requestId}. ${note}`
      });
      if (expLogErr) throw expLogErr;
      
      const { error: reqUpdErr } = await supabaseClient.from('yeu_cau_xuat').update({
        id_vat_tu: itemId,
        ten: name,
        hang: brand,
        quy_cach: spec,
        don_vi: unit,
        so_luong_yeu_cau: approvedQty,
        muc_dich: payload.purpose || req.muc_dich,
        trang_thai: 'Da_Duyet',
        ghi_chu: note
      }).eq('id_yeu_cau', payload.requestId);
      if (reqUpdErr) throw reqUpdErr;
      
      return { success: true };
    }
    
    // 4.1.2. Cancel Export Request (Staff cancels their own request within 20 mins)
    if (payload.action === 'cancel_export_request') {
      const { data: req, error: fetchErr } = await supabaseClient.from('yeu_cau_xuat').select('*').eq('id_yeu_cau', payload.requestId).single();
      if (fetchErr) throw fetchErr;
      
      if (req.trang_thai !== 'Cho_Duyet') {
        throw new Error('Yêu cầu đã được xử lý, không thể hủy!');
      }
      
      const timeDiffMinutes = (Date.now() - new Date(req.ngay_yeu_cau).getTime()) / (60 * 1000);
      if (timeDiffMinutes > 20) {
        throw new Error('Đã quá 20 phút kể từ lúc gửi yêu cầu, không thể hủy!');
      }
      
      const { error: updErr } = await supabaseClient.from('yeu_cau_xuat').update({ trang_thai: 'Da_Huy' }).eq('id_yeu_cau', payload.requestId);
      if (updErr) throw updErr;
      
      return { success: true };
    }
    
    // 4.2. Direct Export (Cart checkout by Admin/Exporter)
    if (payload.action === 'export') {
      const exportQty = parseFloat(payload.qty);
      let updatedSuccess = false;

      // 1. Thử gọi RPC atomic transaction
      try {
        const { data: rpcRes, error: rpcErr } = await supabaseClient.rpc('deduct_inventory', {
          p_item_id: payload.itemId,
          p_deduct_qty: exportQty
        });
        if (!rpcErr && rpcRes && rpcRes.success) {
          updatedSuccess = true;
        }
      } catch(e) {}

      let inv = null;
      if (!updatedSuccess) {
        // 2. Chống Race Condition: Đọc tồn kho tươi từ server
        const { data: freshInv, error: invErr } = await supabaseClient
          .from('kho_vat_tu')
          .select('*')
          .eq('id', payload.itemId)
          .single();
        if (invErr) throw invErr;
        inv = freshInv;
        
        const freshQty = parseFloat(inv.so_luong) || 0;
        if (freshQty < exportQty) {
          throw new Error(`Tồn kho của "${inv.ten}" không đủ xuất! (Hiện còn: ${freshQty}, cần xuất: ${exportQty})`);
        }
        
        const newQty = Math.max(0, Math.round((freshQty - exportQty) * 1000) / 1000);
        const { error: updErr } = await supabaseClient
          .from('kho_vat_tu')
          .update({ so_luong: newQty })
          .eq('id', payload.itemId);
        if (updErr) throw updErr;
      } else {
        const { data: freshInv } = await supabaseClient.from('kho_vat_tu').select('*').eq('id', payload.itemId).single();
        inv = freshInv;
      }
      
      const exportId = "XK" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const userRole = currentRole === 'admin' ? "Admin" : "Người xuất kho";
      const { error: expLogErr } = await supabaseClient.from('lich_su_xuat').insert({
        id_giao_dich: exportId,
        id_vat_tu: payload.itemId,
        ten: inv.ten,
        hang: inv.hang || '',
        quy_cach: inv.quy_cach || '',
        so_luong: exportQty,
        don_vi: inv.don_vi,
        ngay_xuat: payload.date || new Date().toISOString(),
        nguoi_nhan: payload.recipient,
        muc_dich: payload.purpose || 'Xuất trực tiếp',
        nguoi_xuat: userRole,
        ghi_chu: payload.note || ''
      });
      if (expLogErr) throw expLogErr;
      
      return { success: true };
    }
    
    // 5. Reject Export
    if (payload.action === 'reject_export') {
      const { error } = await supabaseClient.from('yeu_cau_xuat').update({
        trang_thai: 'Tu_Choi',
        ghi_chu: payload.note
      }).eq('id_yeu_cau', payload.requestId);
      if (error) throw error;
      return { success: true };
    }
    
    // 6. Edit Inventory (Sửa thông tin)
    if (payload.action === 'edit_inventory') {
      const { data: oldItem, error: oldErr } = await supabaseClient.from('kho_vat_tu').select('*').eq('id', payload.itemId).single();
      if (oldErr) throw oldErr;
      
      const { error: updErr } = await supabaseClient.from('kho_vat_tu').update({
        ma_so: payload.code,
        ten: payload.name,
        hang: payload.brand,
        quy_cach: payload.spec,
        noi_bao_quan: payload.location,
        so_luong: parseFloat(payload.qty) || 0,
        don_vi: payload.unit,
        han_su_dung: payload.expiry,
        nam_nhap: payload.importYear,
        ghi_chu: payload.note,
        dac_tinh_ky_thuat: payload.techSpecs !== undefined ? payload.techSpecs : oldItem.dac_tinh_ky_thuat
      }).eq('id', payload.itemId);
      if (updErr) throw updErr;
      
      const fieldNames = {
        ma_so: "Mã số",
        ten: "Tên vật tư",
        hang: "Xuất xứ",
        quy_cach: "Quy cách",
        noi_bao_quan: "Nơi bảo quản",
        so_luong: "Số lượng tồn",
        don_vi: "Đơn vị tính",
        han_su_dung: "Hạn sử dụng",
        nam_nhap: "Năm nhập",
        ghi_chu: "Ghi chú",
        dac_tinh_ky_thuat: "Đặc tính kỹ thuật"
      };
      
      const changes = [];
      const oldValsMap = {};
      const newVals = {
        ma_so: (payload.code || '').trim(),
        ten: payload.name.trim(),
        hang: (payload.brand || '').trim(),
        quy_cach: (payload.spec || '').trim(),
        noi_bao_quan: (payload.location || '').trim(),
        so_luong: parseFloat(payload.qty) || 0,
        don_vi: (payload.unit || '').trim(),
        han_su_dung: (payload.expiry || '').trim(),
        nam_nhap: (payload.importYear || '').trim(),
        ghi_chu: (payload.note || '').trim(),
        dac_tinh_ky_thuat: (typeof (payload.techSpecs !== undefined ? payload.techSpecs : (oldItem.dac_tinh_ky_thuat || '')) === 'object' ? JSON.stringify(payload.techSpecs !== undefined ? payload.techSpecs : (oldItem.dac_tinh_ky_thuat || '')) : (payload.techSpecs !== undefined ? payload.techSpecs : (oldItem.dac_tinh_ky_thuat || '')).toString()).trim()
      };
      
      Object.keys(fieldNames).forEach(k => {
        let oldStr = '';
        let newStr = '';
        if (k === 'dac_tinh_ky_thuat') {
          const oldVal = oldItem[k];
          const newVal = newVals[k];
          oldStr = (typeof oldVal === 'object' ? JSON.stringify(oldVal || {}) : (oldVal || '').toString()).trim();
          newStr = (typeof newVal === 'object' ? JSON.stringify(newVal || {}) : (newVal || '').toString()).trim();
        } else {
          oldStr = (oldItem[k] || '').toString().trim();
          newStr = (newVals[k] || '').toString().trim();
        }
        if (oldStr !== newStr) {
          changes.push(`${fieldNames[k]}: [${oldStr}] -> [${newStr}]`);
          oldValsMap[k] = oldItem[k] !== null ? oldItem[k] : '';
        }
      });
      
      if (changes.length > 0) {
        const logId = "EDIT" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
        const editor = payload.user || "Admin";
        const detailObj = {
          formatted: changes.join("; "),
          oldValues: oldValsMap
        };
        const { error: logErr } = await supabaseClient.from('lich_su_sua_thong_tin').insert({
          id_log: logId,
          id_vat_tu: payload.itemId,
          ten_vat_tu: oldItem.ten,
          chi_tiet: JSON.stringify(detailObj),
          ngay_chinh_sua: new Date().toISOString(),
          nguoi_sua: editor
        });
        if (logErr) throw logErr;
      }
      return { success: true };
    }
    
    // 7. Delete Chemical
    if (payload.action === 'delete_chemical') {
      // Lấy thông tin vật tư trước khi xóa để làm nhật ký
      const { data: item, error: fetchErr } = await supabaseClient.from('kho_vat_tu').select('ten').eq('id', payload.itemId).single();
      if (fetchErr) throw fetchErr;
      
      const { error: delErr } = await supabaseClient.from('kho_vat_tu').delete().eq('id', payload.itemId);
      if (delErr) throw delErr;
      
      // Ghi nhận nhật ký xóa hóa chất
      const logId = "DEL" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const editor = payload.user || "Admin";
      const { error: logErr } = await supabaseClient.from('lich_su_sua_thong_tin').insert({
        id_log: logId,
        id_vat_tu: payload.itemId,
        ten_vat_tu: item.ten,
        chi_tiet: `Đã xóa hoàn toàn hóa chất/vật tư. Lý do: ${payload.reason || 'Không có lý do'}`,
        ngay_chinh_sua: new Date().toISOString(),
        nguoi_sua: editor
      });
      if (logErr) throw logErr;
      
      return { success: true };
    }

    // 7.5. Rollback Edit (Khôi phục thông tin)
    if (payload.action === 'rollback_edit') {
      const { data: log, error: logErr } = await supabaseClient.from('lich_su_sua_thong_tin').select('*').eq('id_log', payload.logId).single();
      if (logErr) throw logErr;
      
      let oldValues = null;
      try {
        let parsed = log.chi_tiet;
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        if (parsed && typeof parsed === 'object') {
          oldValues = parsed.oldValues;
        } else {
          throw new Error('Not an object');
        }
      } catch (e) {
        // Parse log dạng legacy cũ
        oldValues = {};
        const fieldMapping = {
          "Mã số": "ma_so",
          "Tên vật tư": "ten",
          "Xuất xứ": "hang",
          "Quy cách": "quy_cach",
          "Nơi bảo quản": "noi_bao_quan",
          "Số lượng tồn": "so_luong",
          "Đơn vị tính": "don_vi",
          "Hạn sử dụng": "han_su_dung",
          "Năm nhập": "nam_nhap",
          "Ghi chú": "ghi_chu",
          "Đặc tính kỹ thuật": "dac_tinh_ky_thuat"
        };
        const parts = (log.chi_tiet || '').split("; ");
        parts.forEach(part => {
          const match = part.match(/^([^:]+):\s*\[(.*?)\]\s*->\s*\[(.*?)\]$/);
          if (match) {
            const label = match[1].trim();
            const oldValue = match[2];
            const dbCol = fieldMapping[label];
            if (dbCol) {
              oldValues[dbCol] = dbCol === 'so_luong' ? parseFloat(oldValue) || 0 : oldValue;
            }
          }
        });
      }
      
      if (!oldValues || Object.keys(oldValues).length === 0) {
        throw new Error('Không thể phân tích dữ liệu cũ để khôi phục!');
      }
      
      const { error: updErr } = await supabaseClient.from('kho_vat_tu').update(oldValues).eq('id', log.id_vat_tu);
      if (updErr) throw updErr;
      
      const rollbackLogId = "EDIT" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const editor = payload.user || "Admin";
      const { error: newLogErr } = await supabaseClient.from('lich_su_sua_thong_tin').insert({
        id_log: rollbackLogId,
        id_vat_tu: log.id_vat_tu,
        ten_vat_tu: log.ten_vat_tu,
        chi_tiet: `Khôi phục thông tin về phiên bản ngày ${new Date(log.ngay_chinh_sua).toLocaleString('vi-VN')} (ID Log gốc: ${payload.logId})`,
        ngay_chinh_sua: new Date().toISOString(),
        nguoi_sua: editor
      });
      if (newLogErr) throw newLogErr;
      
      return { success: true };
    }
    
    // 8. Clear All Inventory
    if (payload.action === 'clear_all_inventory') {
      await supabaseClient.from('kho_vat_tu').delete().neq('id', '');
      await supabaseClient.from('lich_su_nhap').delete().neq('id_giao_dich', '');
      await supabaseClient.from('lich_su_xuat').delete().neq('id_giao_dich', '');
      await supabaseClient.from('yeu_cau_xuat').delete().neq('id_yeu_cau', '');
      await supabaseClient.from('lich_su_sua_thong_tin').delete().neq('id_log', '');
      return { success: true };
    }
    
    // 9. Undo Export
    if (payload.action === 'undo_export') {
      const txIds = Array.isArray(payload.transactionIds)
        ? payload.transactionIds
        : (payload.transactionIds ? payload.transactionIds.split(',') : [payload.transactionId].filter(Boolean));

      for (const txId of txIds) {
        const { data: exp, error: expErr } = await supabaseClient.from('lich_su_xuat').select('*').eq('id_giao_dich', txId).maybeSingle();
        if (expErr) throw expErr;
        if (!exp) continue;
        
        const { data: inv, error: invErr } = await supabaseClient.from('kho_vat_tu').select('so_luong').eq('id', exp.id_vat_tu).maybeSingle();
        if (invErr) throw invErr;
        if (inv) {
          const newQty = (parseFloat(inv.so_luong) || 0) + (parseFloat(exp.so_luong) || 0);
          const { error: updErr } = await supabaseClient.from('kho_vat_tu').update({ so_luong: newQty }).eq('id', exp.id_vat_tu);
          if (updErr) throw updErr;
        }
        
        const { error: delErr } = await supabaseClient.from('lich_su_xuat').delete().eq('id_giao_dich', txId);
        if (delErr) throw delErr;
      }
      
      return { success: true };
    }
    
    // 10. Clean History
    if (payload.action === 'clean_history') {
      if (payload.months === 'all_processed') {
        // Xóa sạch tất cả các yêu cầu đã duyệt/từ chối/hủy, không giới hạn thời gian
        await supabaseClient.from('yeu_cau_xuat').delete().neq('trang_thai', 'Cho_Duyet');
      } else {
        let days = 30;
        if (payload.months) {
          days = parseInt(payload.months) * 30;
        } else if (payload.days) {
          days = parseInt(payload.days);
        }
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        await supabaseClient.from('lich_su_nhap').delete().lt('ngay_nhap', cutoffDate);
        await supabaseClient.from('lich_su_xuat').delete().lt('ngay_xuat', cutoffDate);
        await supabaseClient.from('lich_su_sua_thong_tin').delete().lt('ngay_chinh_sua', cutoffDate);
        await supabaseClient.from('yeu_cau_xuat').delete().lt('ngay_yeu_cau', cutoffDate).neq('trang_thai', 'Cho_Duyet');
      }
      return { success: true };
    }
    
    // 11. Propose Spec Feature
    if (payload.action === 'propose_spec_feature') {
      const proposalId = "SPEC" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const { error } = await supabaseClient.from('yeu_cau_dac_tinh').insert({
        id_de_xuat: proposalId,
        id_vat_tu: payload.itemId,
        ten_vat_tu: payload.name,
        dac_tinh_de_xuat: payload.techSpecs,
        ngay_de_xuat: new Date().toISOString(),
        nguoi_de_xuat: payload.user || 'Nhân viên',
        trang_thai: 'Cho_Duyet',
        ghi_chu: ''
      });
      if (error) throw error;
      return { success: true };
    }
    
    // 12. Approve Spec Feature
    if (payload.action === 'approve_spec_feature') {
      const { data: prop, error: propErr } = await supabaseClient.from('yeu_cau_dac_tinh').select('*').eq('id_de_xuat', payload.requestId).single();
      if (propErr) throw propErr;
      
      const { data: oldItem, error: oldErr } = await supabaseClient.from('kho_vat_tu').select('*').eq('id', prop.id_vat_tu).single();
      if (oldErr) throw oldErr;
      
      const { error: updErr } = await supabaseClient.from('kho_vat_tu').update({
        dac_tinh_ky_thuat: prop.dac_tinh_de_xuat
      }).eq('id', prop.id_vat_tu);
      if (updErr) throw updErr;
      
      const { error: propUpdErr } = await supabaseClient.from('yeu_cau_dac_tinh').update({
        trang_thai: 'Da_Duyet'
      }).eq('id_de_xuat', payload.requestId);
      if (propUpdErr) throw propUpdErr;
      
      const logId = "EDIT" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const editor = currentRole === 'admin' ? 'Admin' : 'Người nhập kho';
      const { error: logErr } = await supabaseClient.from('lich_su_sua_thong_tin').insert({
        id_log: logId,
        id_vat_tu: prop.id_vat_tu,
        ten_vat_tu: oldItem.ten,
        chi_tiet: `Đặc tính kỹ thuật: [${oldItem.dac_tinh_ky_thuat || ''}] -> [${prop.dac_tinh_de_xuat}] (Duyệt đề xuất)`,
        ngay_chinh_sua: new Date().toISOString(),
        nguoi_sua: editor
      });
      if (logErr) throw logErr;
      
      return { success: true };
    }
    
    // 13. Reject Spec Feature
    if (payload.action === 'reject_spec_feature') {
      const { error } = await supabaseClient.from('yeu_cau_dac_tinh').update({
        trang_thai: 'Tu_Choi',
        ghi_chu: payload.note || 'Không duyệt sửa đổi'
      }).eq('id_de_xuat', payload.requestId);
      if (error) throw error;
      return { success: true };
    }
    
    // 14. Clear Notification
    if (payload.action === 'clear_notification') {
      const { error } = await supabaseClient.from('yeu_cau_xuat').update({
        trang_thai: 'Da_Doc_Tu_Choi'
      }).eq('id_yeu_cau', payload.requestId);
      if (error) throw error;
      return { success: true };
    }
  }

  const isGoogleEnv = typeof google !== 'undefined' && google.script && google.script.run;
  
  if (isGoogleEnv) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(result => resolve(result))
        .withFailureHandler(error => reject(error))
        .apiDoPost(payload);
    });
  } else {
    if (!appConfig.apiUrl) {
      throw new Error('Chưa cấu hình API URL');
    }
    const response = await fetch(appConfig.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Kết nối mạng thất bại');
    return await response.json();
  }
}

function updateUI() {
  renderInventory();
  renderMyRequests();
  renderAdminRequests();
  renderHistory();
  renderEditLogs();
  populateDropdowns();
  updateCartBadge();
  renderAnnouncement();
  if (typeof renderSharedCabinet === 'function') {
    renderSharedCabinet();
  }
}

async function loadData() {
  showLoading(true);
  initSupabase();
  
  if (supabaseClient) {
    try {
      const [invRes, impRes, expRes, reqRes, logRes, specRes, cfgRes, scRes] = await Promise.all([
        supabaseClient.from('kho_vat_tu').select('*'),
        supabaseClient.from('lich_su_nhap').select('*'),
        supabaseClient.from('lich_su_xuat').select('*'),
        supabaseClient.from('yeu_cau_xuat').select('*'),
        supabaseClient.from('lich_su_sua_thong_tin').select('*'),
        supabaseClient.from('yeu_cau_dac_tinh').select('*'),
        supabaseClient.from('cau_hinh').select('*').eq('key', 'config').maybeSingle(),
        supabaseClient.from('cau_hinh').select('*').eq('key', 'shared_cabinet').maybeSingle()
      ]);
      
      if (invRes.error) throw invRes.error;
      if (impRes.error) throw impRes.error;
      if (expRes.error) throw expRes.error;
      if (reqRes.error) throw reqRes.error;
      if (logRes.error) throw logRes.error;
      if (specRes.error) {
        console.warn("Table yeu_cau_dac_tinh might not exist or failed to load. Fallback to empty. Error:", specRes.error.message);
        specRes.data = [];
      }
      
      appData = {
        inventory: (invRes.data || []).map(i => ({
          ID: i.id,
          Ma_So: i.ma_so,
          Ten: i.ten,
          Hang: i.hang || '',
          Quy_Cach: i.quy_cach || '',
          Noi_Bao_Quan: i.noi_bao_quan,
          So_Luong: parseFloat(i.so_luong) || 0,
          Don_Vi: i.don_vi,
          Han_Su_Dung: i.han_su_dung,
          Nam_Nhap: i.nam_nhap,
          Ghi_Chu: i.ghi_chu,
          Dac_Tinh_Ky_Thuat: i.dac_tinh_ky_thuat
        })),
        imports: (impRes.data || []).map(i => ({
          ID_Giao_Dich: i.id_giao_dich,
          ID_Vat_Tu: i.id_vat_tu,
          Ten: i.ten,
          Hang: i.hang || '',
          Quy_Cach: i.quy_cach || '',
          So_Luong: parseFloat(i.so_luong) || 0,
          Don_Vi: i.don_vi,
          Ngay_Nhap: i.ngay_nhap,
          Nguoi_Nhap: i.nguoi_nhap,
          Ghi_Chu: i.ghi_chu
        })),
        exports: (expRes.data || []).map(e => ({
          ID_Giao_Dich: e.id_giao_dich,
          ID_Vat_Tu: e.id_vat_tu,
          Ten: e.ten,
          Hang: e.hang || '',
          Quy_Cach: e.quy_cach || '',
          So_Luong: parseFloat(e.so_luong) || 0,
          Don_Vi: e.don_vi,
          Ngay_Xuat: e.ngay_xuat,
          Nguoi_Nhan: e.nguoi_nhan,
          Muc_Dich: e.muc_dich,
          Nguoi_Xuat: e.nguoi_xuat,
          Ghi_Chu: e.ghi_chu
        })),
        requests: (reqRes.data || []).map(r => ({
          ID_Yeu_Cau: r.id_yeu_cau,
          ID_Vat_Tu: r.id_vat_tu,
          Ten: r.ten,
          Hang: r.hang || '',
          Quy_Cach: r.quy_cach || '',
          So_Luong_Yeu_Cau: parseFloat(r.so_luong_yeu_cau) || 0,
          Don_Vi: r.don_vi,
          Nguoi_Yeu_Cau: r.nguoi_yeu_cau,
          Muc_Dich: r.muc_dich,
          Ngay_Yeu_Cau: r.ngay_yeu_cau,
          Trang_Thai: r.trang_thai,
          Ghi_Chu: r.ghi_chu
        })),
        editLogs: (logRes.data || []).map(l => ({
          ID_Log: l.id_log,
          ID_Vat_Tu: l.id_vat_tu,
          Ten_Vat_Tu: l.ten_vat_tu,
          Chi_Tiet: l.chi_tiet,
          Ngay_Chinh_Sua: l.ngay_chinh_sua,
          Nguoi_Sua: l.nguoi_sua
        })),
        specRequests: (specRes.data || []).map(s => ({
          ID_De_Xuat: s.id_de_xuat,
          ID_Vat_Tu: s.id_vat_tu,
          Ten_Vat_Tu: s.ten_vat_tu,
          Dac_Tinh_De_Xuat: s.dac_tinh_de_xuat,
          Ngay_De_Xuat: s.ngay_de_xuat,
          Nguoi_De_Xuat: s.nguoi_de_xuat,
          Trang_Thai: s.trang_thai,
          Ghi_Chu: s.ghi_chu
        }))
      };

      // Nạp dữ liệu Tủ Hóa Chất Dùng Chung
      let scList = null;
      if (scRes && scRes.data && scRes.data.value) {
        try {
          scList = typeof scRes.data.value === 'string' ? JSON.parse(scRes.data.value) : scRes.data.value;
        } catch(e) { console.warn('Lỗi parse shared_cabinet từ Supabase:', e); }
      }
      if (!scList || !Array.isArray(scList)) {
        const savedShared = localStorage.getItem('LAB_SHARED_CABINET_V1');
        if (savedShared) {
          try { scList = JSON.parse(savedShared); } catch(e){}
        }
      }
      if (!scList || !Array.isArray(scList)) {
        scList = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.sharedCabinet || []));
      }
      appData.sharedCabinet = scList;
      localStorage.setItem('LAB_SHARED_CABINET_V1', JSON.stringify(appData.sharedCabinet));

      if (appData.inventory) {
        appData.inventory.forEach(item => {
          if (item.Hang === 'K/P') item.Hang = '';
          if (item.Quy_Cach === 'K/P') item.Quy_Cach = '';
        });
      }
      
      if (cfgRes.data && cfgRes.data.value) {
        try {
          let parsedConfig = cfgRes.data.value;
          if (typeof parsedConfig === 'string') {
            parsedConfig = JSON.parse(parsedConfig);
          }
          appConfig = { ...appConfig, ...parsedConfig };
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
          renderSettings();
          applyAppConfigUI();
          updateNavigationByRole();
        } catch(e) {
          console.error('Lỗi phân tích cấu hình từ Supabase:', e);
        }
      }
      
      // Bỏ toast tải dữ liệu nền để tránh rối mắt cho người dùng
      console.log('Tải dữ liệu từ Supabase thành công!');
      updateUI();
      showLoading(false);
      return;
    } catch(err) {
      console.error('Supabase load error:', err);
      showToast('Lỗi Supabase: ' + err.message + '. Sử dụng dữ liệu cục bộ.', 'warning');
      loadMockData();
      updateUI();
      showLoading(false);
      return;
    }
  }

  const isGoogleEnv = typeof google !== 'undefined' && google.script && google.script.run;
  const currentPin = appConfig.staffPin || appConfig.exporterPin || appConfig.importerPin || appConfig.adminPin || '';
  
  if (isGoogleEnv) {
    try {
      const result = await new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(res => resolve(res))
          .withFailureHandler(err => reject(err))
          .apiGetData(currentPin);
      });
      if (result.success) {
        appData = result.data;
        if (!appData.requests) appData.requests = [];
        if (!appData.editLogs) appData.editLogs = [];
        
        // Đồng bộ cấu hình từ Sheets xuống Client
        if (result.config && Object.keys(result.config).length > 0) {
          appConfig = { ...appConfig, ...result.config };
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
          renderSettings();
          applyAppConfigUI();
          updateNavigationByRole();
        }
        
        // Bỏ toast tải dữ liệu nền để tránh rối mắt cho người dùng
        console.log('Tải dữ liệu từ Google Sheets thành công!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi Apps Script: ' + error.message, 'danger');
      loadMockData();
      updateUI();
      showLoading(false);
    }
  } else {
    let fetchUrl = appConfig.apiUrl;
    if (fetchUrl && fetchUrl.includes('script.google.com')) {
      fetchUrl += fetchUrl.includes('?') ? '&api=true' : '?api=true';
      if (currentPin) {
        fetchUrl += '&pin=' + encodeURIComponent(currentPin);
      }
    }
    
    if (fetchUrl) {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets API');
        const json = await response.json();
        if (json.success) {
          appData = json.data;
          if (!appData.requests) appData.requests = [];
          if (!appData.editLogs) appData.editLogs = [];
          
          if (appData.inventory) {
            appData.inventory.forEach(item => {
              if (item.Hang === 'K/P') item.Hang = '';
              if (item.Quy_Cach === 'K/P') item.Quy_Cach = '';
            });
          }
          
          // Đồng bộ cấu hình từ Sheets xuống Client
          if (json.config && Object.keys(json.config).length > 0) {
            appConfig = { ...appConfig, ...json.config };
            localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
            renderSettings();
          }
          
          // Bỏ toast tải dữ liệu nền để tránh rối mắt cho người dùng
          console.log('Tải dữ liệu từ Google Sheets thành công!');
          updateUI();
          showLoading(false);
        } else {
          throw new Error(json.message);
        }
      } catch (error) {
        console.error(error);
        showToast('Lỗi kết nối Google Sheets. Sử dụng dữ liệu cục bộ.', 'warning');
        loadMockData();
        updateUI();
        showLoading(false);
      }
    } else {
      loadMockData();
      updateUI();
      showLoading(false);
    }
  }
  
  showLoading(false);
  updateUI();
}

function loadMockData() {
  const savedMock = localStorage.getItem(MOCK_STORAGE_KEY);
  try {
    appData = savedMock ? JSON.parse(savedMock) : null;
  } catch (e) {
    console.error("Failed to parse mock data:", e);
    appData = null;
  }
  if (!appData || typeof appData !== 'object') {
    appData = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  }
  if (!appData.inventory) appData.inventory = [];
  if (!appData.imports) appData.imports = [];
  if (!appData.exports) appData.exports = [];
  if (!appData.requests) appData.requests = [];
  if (!appData.editLogs) appData.editLogs = [];
  if (!appData.specRequests) appData.specRequests = [];
  
  if (!appData.sharedCabinet || !Array.isArray(appData.sharedCabinet)) {
    const savedShared = localStorage.getItem('LAB_SHARED_CABINET_V1');
    if (savedShared) {
      try { appData.sharedCabinet = JSON.parse(savedShared); } catch(e){}
    }
  }
  if (!appData.sharedCabinet || !Array.isArray(appData.sharedCabinet)) {
    appData.sharedCabinet = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.sharedCabinet || []));
  }
  localStorage.setItem('LAB_SHARED_CABINET_V1', JSON.stringify(appData.sharedCabinet));
  
  appData.inventory.forEach(item => {
    if (item.Hang === 'K/P') item.Hang = '';
    if (item.Quy_Cach === 'K/P') item.Quy_Cach = '';
  });
  
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(appData));
}

function saveMockData() {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(appData));
}

function showLoading(show) {
  const elements = document.querySelectorAll('.loading-indicator');
  elements.forEach(el => el.style.display = show ? 'flex' : 'none');
}

// --- HỆ THỐNG PHÂN QUYỀN 4 VAI TRÒ ---
function updateNavigationByRole(forceTab = null) {
  const isStaff = currentRole === 'staff';
  const isStudent = currentRole === 'student';
  const isImporter = currentRole === 'importer';
  const isExporter = currentRole === 'exporter';
  const isAdmin = currentRole === 'admin';
  
  const toggleNav = (id, show) => {
    const el = document.getElementById(id);
    const mobEl = document.getElementById('mobile-' + id);
    if (el) el.style.display = show ? 'flex' : 'none';
    if (mobEl) mobEl.style.display = show ? 'flex' : 'none';
  };
  
  toggleNav('nav-inventory', true);
  toggleNav('nav-shared-cabinet', true);
  toggleNav('nav-cart', isStaff || isStudent || isExporter || (isAdmin && appConfig.showAdminCartTab));
  toggleNav('nav-import', isImporter || (isAdmin && appConfig.showAdminImportTab));
  toggleNav('nav-export', isExporter || isImporter || (isAdmin && appConfig.showAdminExportTab));
  toggleNav('nav-history', isStaff || isImporter || isExporter || isAdmin);
  toggleNav('nav-dashboard', isImporter || isExporter || isAdmin);
  toggleNav('nav-notifications', isStaff || isAdmin);
  toggleNav('nav-settings', isAdmin);
  
  const directExportCard = document.getElementById('direct-export-card');
  if (directExportCard) {
    directExportCard.style.display = isAdmin ? 'block' : 'none';
  }
  
  document.getElementById('excel-import-btn').style.display = (isAdmin || isImporter) ? 'inline-block' : 'none';

  // Phân quyền tại Tủ Dùng Chung: Sinh viên không được thêm hoặc nạp Excel
  const btnOpenScAddModal = document.getElementById('btn-open-sc-add-modal');
  const btnScImportExcel = document.getElementById('btn-sc-import-excel');
  if (btnOpenScAddModal) btnOpenScAddModal.style.display = isStudent ? 'none' : 'inline-flex';
  if (btnScImportExcel) btnScImportExcel.style.display = isStudent ? 'none' : 'inline-flex';

  const roleBadge = document.getElementById('current-role-badge');
  if (roleBadge) {
    const roleNames = {
      'admin': 'Quản trị viên (Admin)',
      'exporter': 'Người xuất kho',
      'importer': 'Người nhập kho',
      'staff': 'Nhân viên',
      'student': 'Sinh viên'
    };
    roleBadge.innerText = roleNames[currentRole] || 'Nhân viên';
  }

  const adminCells = document.querySelectorAll('.admin-only-cell');
  adminCells.forEach(cell => {
    cell.style.display = (isAdmin || isExporter || isImporter) ? '' : 'none';
  });

  updateNotificationDots();

  // Phân quyền cho nút chỉnh sửa Ghi chú / Thông báo
  const announcementEditBtn = document.getElementById('announcement-edit-btn');
  if (announcementEditBtn) {
    const canEditAnnouncement = isAdmin || isExporter || isImporter;
    announcementEditBtn.style.display = canEditAnnouncement ? 'inline-block' : 'none';
  }

  // Kiểm tra tab có được phép truy cập theo quyền hiện tại không
  const isTabAllowed = (tab) => {
    switch (tab) {
      case 'inventory': return true;
      case 'shared-cabinet': return true;
      case 'cart': return isStaff || isStudent || isExporter || (isAdmin && appConfig.showAdminCartTab);
      case 'import': return isImporter || (isAdmin && appConfig.showAdminImportTab);
      case 'export': return isExporter || isImporter || (isAdmin && appConfig.showAdminExportTab);
      case 'history': return isStaff || isImporter || isExporter || isAdmin;
      case 'dashboard': return isImporter || isExporter || isAdmin;
      case 'notifications': return isStaff || isAdmin;
      case 'settings': return isAdmin;
      default: return false;
    }
  };

  // Xác định tab đang hoạt động trước đó để giữ nguyên vị trí làm việc
  const activeNavItem = document.querySelector('.nav-links .nav-item.active') || document.querySelector('.mobile-bottom-nav .nav-item.active');
  const activeTabContent = document.querySelector('.tab-content.active');
  let currentActiveTab = '';

  if (activeNavItem && activeNavItem.getAttribute('data-tab')) {
    currentActiveTab = activeNavItem.getAttribute('data-tab');
  } else if (activeTabContent && activeTabContent.id) {
    currentActiveTab = activeTabContent.id.replace('-tab', '');
  }

  // Ưu tiên:
  // 1. forceTab nếu được truyền vào
  // 2. Tab hiện tại nếu vẫn hợp lệ với vai trò hiện tại
  // 3. Tab 'inventory' mặc định nếu tab cũ không còn quyền
  let targetTab = forceTab;
  if (!targetTab) {
    if (currentActiveTab && isTabAllowed(currentActiveTab)) {
      targetTab = currentActiveTab;
    } else {
      targetTab = 'inventory';
    }
  }

  switchTab(targetTab);
}

// --- HỆ THỐNG GHI CHÚ / THÔNG BÁO TỒN KHO ---
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

window.toggleAnnouncementExpand = function() {
  const bar = document.getElementById('announcement-card');
  const textEl = document.getElementById('announcement-toggle-text');
  if (!bar) return;
  const isExpanded = bar.classList.toggle('expanded');
  if (textEl) {
    textEl.textContent = isExpanded ? 'Thu gọn ▴' : 'Xem thêm ▾';
  }
};

window.renderAnnouncement = function() {
  const card = document.getElementById('announcement-card');
  const contentEl = document.getElementById('announcement-content');
  const metaEl = document.getElementById('announcement-meta');
  const editBtn = document.getElementById('announcement-edit-btn');
  const toggleBtn = document.getElementById('announcement-toggle-btn');
  
  if (!card || !contentEl || !metaEl) return;
  
  const announcement = appConfig.announcement;
  const canEditAnnouncement = (currentRole === 'admin' || currentRole === 'exporter' || currentRole === 'importer');
  if (editBtn) {
    editBtn.style.display = canEditAnnouncement ? 'inline-flex' : 'none';
  }

  if (announcement && announcement.text && announcement.text.trim()) {
    contentEl.innerHTML = escapeHtml(announcement.text);
    metaEl.textContent = `Cập nhật bởi ${announcement.updatedBy || 'Hệ thống'} • ${announcement.updatedAt || '-'}`;
    card.style.display = 'block';
  } else {
    // Nếu chưa có thông báo nào, hiển thị mặc định cho admin/exporter/importer biết để thiết lập
    if (canEditAnnouncement) {
      contentEl.innerHTML = '<em>Chưa có thông báo. Bấm "Sửa" để thêm thông báo hoặc ghi chú khẩn cho lab.</em>';
      metaEl.textContent = 'Cập nhật lần cuối: -';
      card.style.display = 'block';
    } else {
      // Ẩn bảng đối với nhân viên thường nếu không có thông báo
      card.style.display = 'none';
    }
  }
};

window.openAnnouncementModal = function() {
  const modal = document.getElementById('announcement-modal-overlay');
  const textInput = document.getElementById('announcement-text-input');
  if (modal && textInput) {
    textInput.value = (appConfig.announcement && appConfig.announcement.text) ? appConfig.announcement.text : '';
    modal.classList.add('active');
  }
};

window.closeAnnouncementModal = function() {
  const modal = document.getElementById('announcement-modal-overlay');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.saveAnnouncement = async function() {
  const textInput = document.getElementById('announcement-text-input');
  if (!textInput) return;
  
  const newText = textInput.value.trim();
  const userRoleLabel = currentRole === 'admin' ? 'Admin' : (currentRole === 'exporter' ? 'Người xuất kho' : 'Người nhập kho');
  const timeStr = new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  
  appConfig.announcement = {
    text: newText,
    updatedBy: userRoleLabel,
    updatedAt: timeStr
  };
  
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  renderAnnouncement();
  closeAnnouncementModal();
  
  // Tự động lưu và đồng bộ lên Supabase
  showLoading(true);
  initSupabase();
  if (supabaseClient) {
    try {
      await sendRequest({
        action: 'save_config',
        config: appConfig
      });
      console.log('Đã đồng bộ thông báo mới lên Supabase.');
    } catch (err) {
      console.error('Lỗi đồng bộ thông báo lên Supabase:', err);
    }
  }
  showLoading(false);
};

// --- THIẾT LẬP LẮNG NGHE SỰ KIỆN GIAO DIỆN ---
function setupEventListeners() {
  // 1. Sự kiện Đăng xuất
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('LAB_SESSION_ROLE');
      localStorage.removeItem('LAB_SESSION_PIN');
      localStorage.removeItem('LAB_SESSION_TIME');
      localStorage.removeItem('LAB_SESSION_REMEMBER');
      
      sessionStorage.removeItem('LAB_SESSION_ROLE');
      sessionStorage.removeItem('LAB_SESSION_PIN');
      
      showToast('Đăng xuất thành công!', 'info');
      showLoginScreen(true);
    });
  }

  // 2. Sự kiện Ẩn/Hiện mật khẩu đăng nhập
  const toggleBtn = document.getElementById('login-password-toggle');
  const passInput = document.getElementById('login-password');
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      if (passInput.type === 'password') {
        passInput.type = 'text';
        toggleBtn.innerText = '🔒';
      } else {
        passInput.type = 'password';
        toggleBtn.innerText = '👁️';
      }
    });
  }

  // 3. Thực hiện Đăng nhập
  const doLogin = () => {
    const roleSelect = document.getElementById('login-role');
    const role = roleSelect ? roleSelect.value : 'staff';
    const password = passInput ? passInput.value : '';
    const rememberCheckbox = document.getElementById('login-remember');
    const remember = rememberCheckbox ? rememberCheckbox.checked : false;

    if (!password) {
      showToast('Vui lòng nhập mật khẩu xác thực!', 'warning');
      return;
    }

    const correctPin = getPinForRole(role);
    const adminPin = appConfig.adminPin || '1234';

    if (password === correctPin || password === adminPin) {
      currentRole = role;
      
      if (remember) {
        localStorage.setItem('LAB_SESSION_ROLE', role);
        localStorage.setItem('LAB_SESSION_PIN', password);
        localStorage.setItem('LAB_SESSION_TIME', Date.now().toString());
        localStorage.setItem('LAB_SESSION_REMEMBER', 'true');
      } else {
        sessionStorage.setItem('LAB_SESSION_ROLE', role);
        sessionStorage.setItem('LAB_SESSION_PIN', password);
        localStorage.removeItem('LAB_SESSION_REMEMBER');
      }

      showToast(`Đăng nhập thành công vai trò: ${role === 'admin' ? 'Quản trị viên (Admin)' : role === 'importer' ? 'Người nhập kho' : role === 'exporter' ? 'Người xuất kho' : 'Nhân viên'}!`, 'success');
      showLoginScreen(false);
      
      loadData();
      updateNavigationByRole();
      initSilentPolling();
    } else {
      showToast('Mật khẩu xác thực vai trò không chính xác!', 'danger');
    }
  };

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', doLogin);
  }
  if (passInput) {
    passInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        doLogin();
      }
    });
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const initDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = initDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối';
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.innerHTML = isDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối';
    });
  }

  // SỬA LỖI TÌM KIẾM: Sử dụng bộ lọc dữ liệu thực (Data-driven filtering)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderInventory();
    });
  }

  // Lắng nghe sự kiện lọc theo Vị trí bảo quản
  const locationFilterSelect = document.getElementById('filter-location-select');
  if (locationFilterSelect) {
    locationFilterSelect.addEventListener('change', () => {
      selectedLocationFilter = locationFilterSelect.value;
      renderInventory();
    });
  }

  // Phím tắt nhanh [/] để tìm kiếm vật tư từ bất cứ đâu
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      switchTab('inventory');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // Lắng nghe kiểm tra trùng khi nhập kho
  const importName = document.getElementById('import-name');
  const importCode = document.getElementById('import-code');
  if (importName) {
    importName.addEventListener('input', checkDuplicateImport);
  }
  if (importCode) {
    importCode.addEventListener('input', checkDuplicateImport);
  }

  const excelBtn = document.getElementById('excel-import-btn');
  const excelInput = document.getElementById('excel-file-input');
  if (excelBtn && excelInput) {
    excelBtn.addEventListener('click', () => excelInput.click());
    excelInput.addEventListener('change', handleExcelImport);
  }

  const exportExcelBtn = document.getElementById('export-excel-btn');
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportHistoryToExcel);
  }

  setupQuantityControls();
  setupAutocomplete();

  document.getElementById('import-form').addEventListener('submit', handleImportSubmit);
  document.getElementById('export-form').addEventListener('submit', handleExportSubmit);
  document.getElementById('edit-item-form').addEventListener('submit', handleEditSubmit);
  document.getElementById('cart-action-form').addEventListener('submit', handleCartCheckoutSubmit);

  document.getElementById('config-api-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pinAdmin = document.getElementById('admin-pin-input').value.trim();
    const pinImporter = document.getElementById('importer-pin-input').value.trim();
    const pinExporter = document.getElementById('exporter-pin-input').value.trim();
    const pinStaff = document.getElementById('staff-pin-input').value.trim();
    const pinStudent = document.getElementById('student-pin-input') ? document.getElementById('student-pin-input').value.trim() : '';
    const urlInput = document.getElementById('supabase-url-input') ? document.getElementById('supabase-url-input').value.trim() : '';
    const keyInput = document.getElementById('supabase-key-input') ? document.getElementById('supabase-key-input').value.trim() : '';
    
    if (pinAdmin) appConfig.adminPin = pinAdmin;
    if (pinImporter) appConfig.importerPin = pinImporter;
    if (pinExporter) appConfig.exporterPin = pinExporter;
    appConfig.staffPin = pinStaff;
    if (pinStudent !== '') appConfig.studentPin = pinStudent;
    appConfig.supabaseUrl = urlInput;
    appConfig.supabaseKey = keyInput;
    
    appConfig.showAdminExportTab = document.getElementById('config-show-export').checked;
    appConfig.showAdminImportTab = document.getElementById('config-show-import').checked;
    appConfig.showAdminCartTab = document.getElementById('config-show-cart').checked;
    
    appConfig.permissions = {
      staff: {
        code: document.getElementById('p-staff-code').checked,
        name: document.getElementById('p-staff-name').checked,
        brand: document.getElementById('p-staff-brand').checked,
        spec: document.getElementById('p-staff-spec').checked,
        unit: document.getElementById('p-staff-unit').checked,
        location: document.getElementById('p-staff-location').checked,
        qty: document.getElementById('p-staff-qty').checked,
        expiry: document.getElementById('p-staff-expiry').checked,
        year: document.getElementById('p-staff-year').checked,
        note: document.getElementById('p-staff-note').checked,
        delete: document.getElementById('p-staff-delete').checked
      },
      student: {
        code: document.getElementById('p-student-code').checked,
        name: document.getElementById('p-student-name').checked,
        brand: document.getElementById('p-student-brand').checked,
        spec: document.getElementById('p-student-spec').checked,
        unit: document.getElementById('p-student-unit').checked,
        location: document.getElementById('p-student-location').checked,
        qty: document.getElementById('p-student-qty').checked,
        expiry: document.getElementById('p-student-expiry').checked,
        year: document.getElementById('p-student-year').checked,
        note: document.getElementById('p-student-note').checked,
        delete: document.getElementById('p-student-delete').checked
      },
      importer: {
        code: document.getElementById('p-importer-code').checked,
        name: document.getElementById('p-importer-name').checked,
        brand: document.getElementById('p-importer-brand').checked,
        spec: document.getElementById('p-importer-spec').checked,
        unit: document.getElementById('p-importer-unit').checked,
        location: document.getElementById('p-importer-location').checked,
        qty: document.getElementById('p-importer-qty').checked,
        expiry: document.getElementById('p-importer-expiry').checked,
        year: document.getElementById('p-importer-year').checked,
        note: document.getElementById('p-importer-note').checked,
        delete: document.getElementById('p-importer-delete').checked
      },
      exporter: {
        code: document.getElementById('p-exporter-code').checked,
        name: document.getElementById('p-exporter-name').checked,
        brand: document.getElementById('p-exporter-brand').checked,
        spec: document.getElementById('p-exporter-spec').checked,
        unit: document.getElementById('p-exporter-unit').checked,
        location: document.getElementById('p-exporter-location').checked,
        qty: document.getElementById('p-exporter-qty').checked,
        expiry: document.getElementById('p-exporter-expiry').checked,
        year: document.getElementById('p-exporter-year').checked,
        note: document.getElementById('p-exporter-note').checked,
        delete: document.getElementById('p-exporter-delete').checked
      }
    };
    
    appConfig.APP_TITLE = document.getElementById('config-app-title').value.trim() || "Kho VTHC Phòng CNSH Thực phẩm";
    appConfig.APP_VERSION = document.getElementById('config-app-version').value.trim() || SYSTEM_APP_VERSION;
    appConfig.labOrgName = (document.getElementById('config-lab-org')?.value || '').trim() || "HỆ THỐNG QUẢN LÝ PHÒNG THÍ NGHIỆM";
    appConfig.labRoomName = (document.getElementById('config-lab-room')?.value || '').trim() || "Phòng Thí Nghiệm CNSH Thực Phẩm";
    appConfig.exporterName = (document.getElementById('config-exporter-name')?.value || '').trim() || "Người xuất kho";
    appConfig.TAB_NAME_INVENTORY = document.getElementById('config-tab-inventory').value.trim() || "Tồn Kho";
    appConfig.TAB_NAME_EXPORT = document.getElementById('config-tab-export').value.trim() || "Duyệt & Xuất";
    appConfig.TAB_NAME_IMPORT = document.getElementById('config-tab-import').value.trim() || "Nhập Kho";
    appConfig.TAB_NAME_HISTORY = document.getElementById('config-tab-history').value.trim() || "Lịch Sử";
    appConfig.TAB_NAME_DASHBOARD = document.getElementById('config-tab-dashboard').value.trim() || "Biểu Đồ";
    
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
    
    showLoading(true);
    const payload = {
      action: 'save_config',
      config: appConfig,
      pin: appConfig.adminPin
    };
    
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        showToast('Lưu cấu hình và đồng bộ lên Supabase thành công!', 'success');
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Lưu cấu hình cục bộ thành công! (Không đồng bộ lên Supabase: ' + err.message + ')', 'warning');
    }
    
    // Cập nhật lại session pin của chính admin để tránh bị đăng xuất
    if (currentRole === 'admin') {
      const remember = localStorage.getItem('LAB_SESSION_REMEMBER') === 'true';
      const newAdminPin = appConfig.adminPin || '1234';
      if (remember) {
        localStorage.setItem('LAB_SESSION_PIN', newAdminPin);
      } else {
        sessionStorage.setItem('LAB_SESSION_PIN', newAdminPin);
      }
    }
    
    showLoading(false);
    await loadData();
  });

  // Sự kiện bộ lọc thời gian đổi -> tự động vẽ lại lịch sử
  const reportTimeFilter = document.getElementById('report-time-filter');
  if (reportTimeFilter) {
    reportTimeFilter.addEventListener('change', () => {
      renderHistory();
    });
  }

  // Sự kiện chuyển đổi chế độ xem Lịch sử (Dòng thời gian vs Bảng biểu)
  const toggleTimelineBtn = document.getElementById('toggle-timeline-btn');
  const toggleTablesBtn = document.getElementById('toggle-tables-btn');
  if (toggleTimelineBtn && toggleTablesBtn) {
    toggleTimelineBtn.addEventListener('click', () => switchHistoryView('timeline'));
    toggleTablesBtn.addEventListener('click', () => switchHistoryView('tables'));
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const activeContent = document.getElementById(`${tabId}-tab`);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  if (tabId === 'inventory') {
    renderInventory();
  } else if (tabId === 'shared-cabinet') {
    if (typeof renderSharedCabinet === 'function') {
      renderSharedCabinet();
    }
  } else if (tabId === 'cart') {
    renderCart();
    renderCancelledRequests();
  } else if (tabId === 'export') {
    renderAdminRequests();
  } else if (tabId === 'history') {
    renderHistory();
    renderEditLogs();
  } else if (tabId === 'dashboard') {
    renderDashboardCharts();
  } else if (tabId === 'settings') {
    renderSettings();
  } else if (tabId === 'notifications') {
    renderNotifications();
  } else if (tabId === 'import') {
    renderImportCart();
  }
}

// --- ĐIỀU CHỈNH SỐ LƯỢNG MẪU (+ / -) ---
function setupQuantityControls() {
  document.querySelectorAll('.quantity-control').forEach(ctrl => {
    const input = ctrl.querySelector('.qty-input');
    const btnMinus = ctrl.querySelector('.qty-minus');
    const btnPlus = ctrl.querySelector('.qty-plus');

    if (!input || !btnMinus || !btnPlus) return;

    btnMinus.onclick = () => {
      let val = parseFloat(input.value) || 0;
      let min = parseFloat(input.getAttribute('min')) || 0;
      if (val - 1 >= min) input.value = val - 1;
      input.dispatchEvent(new Event('change'));
    };

    btnPlus.onclick = () => {
      let val = parseFloat(input.value) || 0;
      let max = parseFloat(input.getAttribute('max')) || Infinity;
      if (val + 1 <= max) input.value = val + 1;
      input.dispatchEvent(new Event('change'));
    };
  });
}

// --- AUTOCOMPLETE ---
function setupAutocomplete() {
  const nameInput = document.getElementById('import-name');
  const suggestionBox = document.getElementById('import-suggestions');

  if (!nameInput || !suggestionBox) return;

  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim();
    if (!val) {
      suggestionBox.style.display = 'none';
      return;
    }

    const cleanVal = removeVietnameseTones(val);
    const matches = appData.inventory.filter(item => 
      removeVietnameseTones(item.Ten).includes(cleanVal)
    );

    if (matches.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }

    suggestionBox.innerHTML = '';
    matches.slice(0, 5).forEach(item => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.innerText = `${item.Ten} (${item.Hang} - ${item.Quy_Cach})`;
      div.onclick = () => {
        nameInput.value = item.Ten;
        document.getElementById('import-code').value = item.Ma_So || '';
        document.getElementById('import-brand').value = item.Hang;
        document.getElementById('import-spec').value = item.Quy_Cach;
        document.getElementById('import-location').value = item.Noi_Bao_Quan || '';
        document.getElementById('import-unit').value = item.Don_Vi;
        suggestionBox.style.display = 'none';
      };
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = 'block';
  });

  // Tự động đóng hộp gợi ý khi click ra ngoài
  document.addEventListener('click', (e) => {
    if (e.target !== nameInput && !suggestionBox.contains(e.target)) {
      suggestionBox.style.display = 'none';
    }
  });

  // Autocomplete cho ô Tên hóa chất khi Nhập nhanh vào Tủ Dùng Chung (sc-add-name)
  const scNameInput = document.getElementById('sc-add-name');
  const scSuggestionBox = document.getElementById('sc-add-suggestions');

  if (scNameInput && scSuggestionBox) {
    scNameInput.addEventListener('input', () => {
      const val = scNameInput.value.trim();
      if (!val) {
        scSuggestionBox.style.display = 'none';
        return;
      }

      if (!appData || !appData.inventory) {
        scSuggestionBox.style.display = 'none';
        return;
      }

      const cleanVal = removeVietnameseTones(val.toLowerCase());
      const matches = appData.inventory.filter(item => {
        const itemTen = removeVietnameseTones((item.Ten || '').toLowerCase());
        const itemMa = removeVietnameseTones((item.Ma_So || '').toLowerCase());
        const itemHang = removeVietnameseTones((item.Hang || '').toLowerCase());
        return itemTen.includes(cleanVal) || itemMa.includes(cleanVal) || itemHang.includes(cleanVal);
      });

      if (matches.length === 0) {
        scSuggestionBox.style.display = 'none';
        return;
      }

      scSuggestionBox.innerHTML = '';
      matches.slice(0, 7).forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.style.padding = '0.55rem 0.85rem';
        div.style.cursor = 'pointer';
        div.style.borderBottom = '1px solid var(--border)';
        div.innerHTML = `
          <div style="font-weight: 700; color: var(--primary); font-size: 0.92rem; display: flex; align-items: center; gap: 0.4rem;">
            ${item.Ma_So ? `<span class="item-code-chip">${escapeHtml(item.Ma_So)}</span>` : ''}
            <span>${escapeHtml(item.Ten)}</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
            Hãng: <strong style="color: var(--text-secondary);">${escapeHtml(item.Hang || 'VN')}</strong> | 
            Quy cách: <strong style="color: var(--text-secondary);">${escapeHtml(item.Quy_Cach || 'Chưa rõ')}</strong> | 
            ĐVT: ${escapeHtml(item.Don_Vi || 'Chai')}
            ${item.Noi_Bao_Quan ? ` | Kho: ${escapeHtml(item.Noi_Bao_Quan)}` : ''}
          </div>
        `;
        div.onmouseover = () => div.style.background = 'var(--bg-hover)';
        div.onmouseout = () => div.style.background = '';
        div.onclick = () => {
          scNameInput.value = item.Ten;
          const codeEl = document.getElementById('sc-add-code');
          const brandEl = document.getElementById('sc-add-brand');
          const specEl = document.getElementById('sc-add-spec');
          const unitEl = document.getElementById('sc-add-unit');
          const remainEl = document.getElementById('sc-add-remain');

          if (codeEl && item.Ma_So) codeEl.value = item.Ma_So;
          if (brandEl && item.Hang) brandEl.value = item.Hang;
          if (specEl && item.Quy_Cach) specEl.value = item.Quy_Cach;
          if (unitEl && item.Don_Vi) unitEl.value = item.Don_Vi;
          if (remainEl && !remainEl.value) {
            remainEl.value = item.Quy_Cach ? (item.Quy_Cach + ' (còn dở)') : 'Còn dở';
          }

          scSuggestionBox.style.display = 'none';
          showToast(`Đã tự động điền thông tin [${item.Ten}] từ tồn kho!`, 'success');
        };
        scSuggestionBox.appendChild(div);
      });
      scSuggestionBox.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (e.target !== scNameInput && !scSuggestionBox.contains(e.target)) {
        scSuggestionBox.style.display = 'none';
      }
    });
  }
}

// --- ĐỒNG BỘ POPULATE DROPDOWNS ---
function fillDatalist(id, list) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  list.forEach(val => {
    const opt = document.createElement('option');
    opt.value = val;
    el.appendChild(opt);
  });
}

function populateDropdowns() {
  fillSelect('import-brand', appConfig.brands);
  fillSelect('import-spec', appConfig.specs);
  fillSelect('import-unit', appConfig.units);
  fillSelect('import-location', appConfig.locations || []);
  fillSelect('cart-purpose', appConfig.purposes);
  fillSelect('cart-recipient', appConfig.recipients);
  fillSelect('export-purpose', appConfig.purposes);
  fillSelect('export-recipient', appConfig.recipients);

  // Điền dữ liệu cho datalists phục vụ chọn nhanh dạng select-input
  fillDatalist('list-brands', appConfig.brands || []);
  fillDatalist('list-specs', appConfig.specs || []);
  fillDatalist('list-units', appConfig.units || []);
  
  const mergedLocs = [...new Set([...(appConfig.locations || []), ...appData.inventory.map(i => i.Noi_Bao_Quan).filter(Boolean)])];
  fillDatalist('list-locations', mergedLocs.length > 0 ? mergedLocs : ['Tủ A', 'Tủ B', 'Tủ C', 'Kho A', 'Tủ cá nhân']);
  fillDatalist('list-shared-locations', appConfig.sharedLocations || ['Tủ dùng chung A', 'Tủ dùng chung B', 'Tủ hút', 'Tủ lạnh 4°C']);
  
  const allNames = [...new Set(appData.inventory.map(i => i.Ten).filter(Boolean))];
  fillDatalist('list-all-chem-names', allNames);

  const exportSelect = document.getElementById('export-item-id');
  if (exportSelect) {
    exportSelect.innerHTML = '<option value="">-- Chọn từ tồn kho --</option>';
    const sortedInv = [...appData.inventory].sort((a, b) => a.Ten.localeCompare(b.Ten));
    sortedInv.forEach(item => {
      if (item.So_Luong > 0) {
        const option = document.createElement('option');
        option.value = item.ID;
        option.innerText = `[${item.Ma_So || 'K/M'}] ${item.Ten} | Hãng: ${item.Hang} (Tồn: ${item.So_Luong} ${item.Don_Vi})`;
        exportSelect.appendChild(option);
      }
    });
    exportSelect.onchange = handleExportItemChange;
  }
}

function handleExportItemChange() {
  const select = document.getElementById('export-item-id');
  const qtyInput = document.getElementById('export-qty');
  const help = document.getElementById('export-qty-help');
  
  if (!select || !qtyInput) return;
  const itemId = select.value;
  if (!itemId) {
    qtyInput.value = 1;
    qtyInput.setAttribute('max', Infinity);
    return;
  }

  const item = appData.inventory.find(i => i.ID === itemId);
  if (item) {
    qtyInput.setAttribute('max', item.So_Luong);
    qtyInput.value = Math.min(parseFloat(qtyInput.value) || 1, item.So_Luong);
    if (help) help.innerHTML = `<span class="badge badge-warning">Còn tồn: ${item.So_Luong} ${item.Don_Vi}</span>`;
  }
}

function fillSelect(elemId, dataArray) {
  const select = document.getElementById(elemId);
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = `<option value="">-- Chọn hoặc tự nhập mới --</option>`;
  dataArray.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.innerText = item;
    select.appendChild(opt);
  });
  if (currentVal && dataArray.includes(currentVal)) {
    select.value = currentVal;
  }
}

// --- CHUẨN HÓA TÊN HÓA CHẤT & DỮ LIỆU BẢNG TỒN KHO ---
function formatChemicalName(rawName) {
  if (!rawName || typeof rawName !== 'string') return '';
  let str = rawName.trim();
  if (!str) return '';

  const chemicalDict = {
    'naoh': 'NaOH', 'nacl': 'NaCl', 'hno3': 'HNO3', 'hcl': 'HCl', 'h2so4': 'H2SO4',
    'koh': 'KOH', 'caco3': 'CaCO3', 'cuso4': 'CuSO4', 'feso4': 'FeSO4', 'fecl3': 'FeCl3',
    'fecl2': 'FeCl2', 'kmno4': 'KMnO4', 'ch3cooh': 'CH3COOH', 'c2h5oh': 'C2H5OH',
    'nahco3': 'NaHCO3', 'na2co3': 'Na2CO3', 'mgso4': 'MgSO4', 'bacl2': 'BaCl2',
    'agno3': 'AgNO3', 'h2o2': 'H2O2', 'nh4oh': 'NH4OH', '(nh4)2so4': '(NH4)2SO4',
    'na2hpo4': 'Na2HPO4', 'kh2po4': 'KH2PO4', 'k2hpo4': 'K2HPO4', 'edta': 'EDTA',
    'sds': 'SDS', 'pbs': 'PBS', 'tae': 'TAE', 'tbe': 'TBE', 'dtt': 'DTT', 'dmso': 'DMSO',
    'tris-hcl': 'Tris-HCl', 'tris hcl': 'Tris-HCl', 'h2o': 'H2O', 'ki': 'KI', 'i2': 'I2',
    'fe2o3': 'Fe2O3', 'al2o3': 'Al2O3', 'zno': 'ZnO', 'znso4': 'ZnSO4', 'mgcl2': 'MgCl2',
    'cacl2': 'CaCl2'
  };

  // 1. Nếu nguyên chuỗi là từ khóa trong từ điển
  const lower = str.toLowerCase();
  if (chemicalDict[lower]) return chemicalDict[lower];

  // 2. Thay thế các từ độc lập hoặc công thức con
  str = str.replace(/\b([a-zA-Z0-9\(\)]+)\b/g, (match) => {
    const mLower = match.toLowerCase();
    return chemicalDict[mLower] || match;
  });

  // 3. Viết hoa chữ cái đầu nếu chuỗi bắt đầu bằng chữ thường
  if (str.length > 0 && /^[a-zà-ỹ]/i.test(str)) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }

  return str;
}

// Helper thể hiện rõ ràng dữ liệu thiếu thay vì dấu '-' thô cứng
function renderMissingData(val, type = 'default') {
  if (!val || typeof val !== 'string' || val.trim() === '' || val.trim() === '-' || val.trim() === 'K/P') {
    switch (type) {
      case 'code':
        return `<span class="missing-text">Chưa cấp mã</span>`;
      case 'brand':
        return `<span class="missing-text">Chưa rõ hãng</span>`;
      case 'spec':
        return `<span class="missing-text">Chưa cập nhật</span>`;
      case 'location':
        return `<span class="missing-text">Chưa xếp vị trí</span>`;
      case 'expiry':
        return `<span class="missing-text">K/HSD</span>`;
      default:
        return `<span class="missing-text">Chưa rõ</span>`;
    }
  }
  return escapeHtml(val.trim());
}

// --- RENDER HÀNG TIÊU ĐỀ BẢNG TỒN KHO THỰC TẾ ---
function renderInventoryHeaders() {
  const headerRow = document.getElementById('inventory-table-header-row');
  if (!headerRow) return;
  
  const customFields = appConfig.customFields || [];
  const isStudent = currentRole === 'student';
  
  let html = `
    <th style="width: 95px; text-align: center;">Mã Số</th>
    <th style="width: 24%; min-width: 190px;">Tên Vật Tư /<br>Hóa Chất</th>
    <th style="width: 130px;">Xuất Xứ /<br>Hãng</th>
    <th style="width: 130px;">Quy Cách</th>
  `;
  
  if (!isStudent) {
    html += `<th style="width: 155px;">Vị Trí<br>Bảo Quản</th>`;
  }
  
  html += `<th style="width: 75px; text-align: center;">Đơn Vị</th>`;
  
  customFields.forEach(cf => {
    html += `<th style="min-width: 110px;">${escapeHtml(cf.label)}</th>`;
  });
  
  if (!isStudent) {
    html += `<th style="width: 105px; text-align: right;">Số Lượng<br>Tồn</th>`;
  }
  
  html += `
    <th style="width: 130px; text-align: center;">Cần xuất</th>
    <th style="text-align: right; width: 125px;" class="admin-only-cell">Hành Động</th>
  `;
  
  headerRow.innerHTML = html;
}

// --- RENDER BẢNG TỒN KHO THỰC TẾ ---
function renderInventory() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody || !appData) return;

  populateLocationFilter();
  renderInventoryHeaders();
  tbody.innerHTML = '';
  
  // Áp dụng bộ lọc tìm kiếm và vị trí
  const cleanKeyword = removeVietnameseTones(searchQuery);
  const keywordParts = cleanKeyword.split(/\s+/).filter(part => part.length > 0);
  
  const filteredInventory = appData.inventory.filter(item => {
    if (currentRole === 'student' && (parseFloat(item.So_Luong) || 0) <= 0) {
      return false;
    }
    // Lọc theo Vị trí bảo quản đã chọn
    if (selectedLocationFilter && (item.Noi_Bao_Quan || '').trim() !== selectedLocationFilter) {
      return false;
    }
    if (keywordParts.length === 0) return true;
    const itemText = removeVietnameseTones(
      `${item.Ma_So || ''} ${item.Ten || ''} ${item.Hang || ''} ${item.Quy_Cach || ''} ${item.Noi_Bao_Quan || ''} ${item.Ghi_Chu || ''}`
    );
    return keywordParts.every(part => itemText.includes(part));
  });

  const isStudent = currentRole === 'student';
  const totalCols = (isStudent ? 7 : 9) + (appConfig.customFields || []).length;
  if (filteredInventory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${totalCols}" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Không tìm thấy vật tư nào phù hợp.</td></tr>`;
    return;
  }

  filteredInventory.forEach(item => {
    const tr = document.createElement('tr');
    
    let qtyBadgeClass = 'badge-success';
    if (item.So_Luong === 0) {
      qtyBadgeClass = 'badge-danger';
    } else if (item.So_Luong <= 2) {
      qtyBadgeClass = 'badge-warning';
    }

    const isAdmin = currentRole === 'admin';
    const canRequest = currentRole === 'staff' || currentRole === 'student' || currentRole === 'exporter' || currentRole === 'admin';

    // Cột Cần xuất chọn nhanh số lượng
    let qtySelectHtml = '';
    if (item.So_Luong > 0 && canRequest) {
      const maxVal = isStudent ? 9999 : item.So_Luong;
      qtySelectHtml = `
        <div class="qty-control-sm">
          <button type="button" class="qty-btn-sm" onclick="adjustRowQty('${item.ID}', -1)">-</button>
          <input type="number" id="row-qty-${item.ID}" class="qty-input-sm" value="1" min="1" max="${maxVal}">
          <button type="button" class="qty-btn-sm" onclick="adjustRowQty('${item.ID}', 1)">+</button>
        </div>
      `;
    } else if (item.So_Luong <= 0) {
      qtySelectHtml = `<span class="stock-empty-text">Hết tồn kho</span>`;
    } else {
      qtySelectHtml = `<span class="missing-text">-</span>`;
    }

    // Cột hành động sửa
    let actionBtnHtml = '';
    const hasAnyEditPermission = (role) => {
      if (role === 'admin') return true;
      if (!appConfig || !appConfig.permissions || !appConfig.permissions[role]) return false;
      return Object.values(appConfig.permissions[role]).some(val => val === true);
    };
    const canEdit = isAdmin || hasAnyEditPermission(currentRole);
    if (canEdit) {
      actionBtnHtml = `
        <td style="text-align: right;" class="admin-only-cell">
          <button type="button" class="btn btn-secondary btn-sm" style="margin-right: 0.25rem;" onclick="openEditModal('${item.ID}')">Sửa 📝</button>
          ${item.So_Luong > 0 && (isAdmin || currentRole === 'exporter') ? `<button type="button" class="btn btn-primary btn-sm" onclick="addToCart('${item.ID}')">Thêm giỏ 🛒</button>` : ''}
        </td>
      `;
    } else if (canRequest && item.So_Luong > 0) {
      actionBtnHtml = `
        <td style="text-align: right;">
          <button type="button" class="btn btn-primary btn-sm" onclick="addToCart('${item.ID}')">Thêm giỏ 🛒</button>
        </td>
      `;
    } else {
      actionBtnHtml = `<td style="text-align: right;"><span class="missing-text">-</span></td>`;
    }

    const cleanHang = (item.Hang && item.Hang !== 'K/P') ? item.Hang : '';
    const cleanQuyCach = (item.Quy_Cach && item.Quy_Cach !== 'K/P') ? item.Quy_Cach : '';

    // Vẽ các cột custom fields động
    let customCellsHtml = '';
    const customFields = appConfig.customFields || [];
    customFields.forEach(cf => {
      const val = getCustomFieldValue(item, cf.key);
      const isExpiryField = (cf.key && cf.key.toLowerCase().includes('han')) || (cf.label && cf.label.toLowerCase().includes('hạn'));
      if (!val || val === '-' || val === cf.defaultValue) {
        customCellsHtml += `<td>${renderMissingData(val, isExpiryField ? 'expiry' : 'default')}</td>`;
      } else {
        customCellsHtml += `<td>${escapeHtml(val)}</td>`;
      }
    });

    const formattedName = formatChemicalName(item.Ten);
    const nameCellHtml = isStudent 
      ? `<strong>${escapeHtml(formattedName)}</strong>` 
      : `<span class="clickable-item-name" style="cursor: pointer; color: var(--primary); text-decoration: none;" onclick="openItemHistoryModal('${item.ID}')"><strong>${escapeHtml(formattedName)}</strong></span>`;
      
    // Căn phải số lượng tồn kho
    const qtyBadgeHtml = isStudent 
      ? ''
      : `<td style="text-align: right;"><span class="badge ${qtyBadgeClass}" style="font-variant-numeric: tabular-nums; font-family: monospace; font-size: 0.85rem; font-weight: 700; min-width: 44px; text-align: right;">${item.So_Luong}</span></td>`;

    const codeHtml = (item.Ma_So && item.Ma_So !== '-') 
      ? `<span class="item-code-chip">${escapeHtml(item.Ma_So)}</span>` 
      : renderMissingData('', 'code');

    const brandHtml = cleanHang 
      ? `<span class="badge badge-primary">${escapeHtml(cleanHang)}</span>` 
      : renderMissingData('', 'brand');

    const specHtml = cleanQuyCach ? escapeHtml(cleanQuyCach) : renderMissingData('', 'spec');

    const locationCellHtml = isStudent
      ? ''
      : `<td>${(item.Noi_Bao_Quan && item.Noi_Bao_Quan !== '-') ? `<span style="color: var(--success); font-weight: 600;">${escapeHtml(item.Noi_Bao_Quan)}</span>` : renderMissingData('', 'location')}</td>`;

    tr.innerHTML = `
      <td style="text-align: center;">${codeHtml}</td>
      <td>${nameCellHtml}</td>
      <td>${brandHtml}</td>
      <td>${specHtml}</td>
      ${locationCellHtml}
      <td>${escapeHtml(item.Don_Vi || 'Cái')}</td>
      ${customCellsHtml}
      ${qtyBadgeHtml}
      <td style="text-align: center;">${qtySelectHtml}</td>
      ${actionBtnHtml}
    `;
    tbody.appendChild(tr);
  });
}

// --- XEM LỊCH SỬ RIÊNG BIỆT CỦA 1 VẬT TƯ/HÓA CHẤT ---
let currentViewingItemId = null;

window.openItemHistoryModal = function(itemId) {
  if (currentRole === 'student') {
    alert("Bạn không có quyền xem lịch sử chi tiết của hóa chất / vật tư!");
    return;
  }
  if (!appData) return;
  const item = appData.inventory.find(i => i.ID === itemId);
  if (!item) return;

  currentViewingItemId = itemId;

  // Cập nhật tiêu đề modal
  const modalTitle = document.getElementById('item-history-modal-title');
  if (modalTitle) {
    modalTitle.innerHTML = `🧪 Chi tiết: <span style="color: var(--primary);">${item.Ten}</span>`;
  }

  // 1. Điền thông tin cơ bản & Đặc tính
  document.getElementById('item-detail-code').textContent = item.Ma_So || '-';
  document.getElementById('item-detail-name').textContent = item.Ten || '-';
  document.getElementById('item-detail-brand').textContent = item.Hang || '-';
  document.getElementById('item-detail-spec').textContent = item.Quy_Cach || '-';
  document.getElementById('item-detail-location').textContent = item.Noi_Bao_Quan || '-';
  document.getElementById('item-detail-qty').textContent = item.So_Luong;
  document.getElementById('item-detail-unit').textContent = item.Don_Vi || 'Cái';
  document.getElementById('item-detail-expiry').textContent = item.Han_Su_Dung || '-';
  document.getElementById('item-detail-year').textContent = item.Nam_Nhap || '-';
  document.getElementById('item-detail-note').textContent = item.Ghi_Chu || '-';
  
  const techSpecsArea = document.getElementById('item-detail-tech-specs');
  if (techSpecsArea) {
    techSpecsArea.value = getTechSpecsText(item) || '';
  }

  // Phân quyền nhãn nút lưu
  const saveBtn = document.getElementById('btn-save-tech-specs');
  if (saveBtn) {
    if (currentRole === 'staff') {
      saveBtn.textContent = '🚀 Gửi đề xuất đặc tính kỹ thuật';
    } else {
      saveBtn.textContent = '💾 Lưu đặc tính kỹ thuật';
    }
  }

  // Check đề xuất đặc tính kỹ thuật chờ duyệt
  const pendingSpecsMsg = document.getElementById('tech-specs-pending-msg');
  const hasPendingSpec = appData.specRequests && appData.specRequests.some(r => r.ID_Vat_Tu === itemId && r.Trang_Thai === 'Cho_Duyet');
  if (pendingSpecsMsg) {
    pendingSpecsMsg.style.display = hasPendingSpec ? 'inline' : 'none';
  }

  // Mặc định về Tab 1
  switchModalTab('info');

  // 2. Render lịch sử nhập kho của vật tư này
  const importTbody = document.getElementById('item-import-history-tbody');
  if (importTbody) {
    importTbody.innerHTML = '';
    const itemImports = (appData.imports || []).filter(imp => imp.ID_Vat_Tu === itemId);
    if (itemImports.length === 0) {
      importTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Chưa có lịch sử nhập kho cho vật tư này.</td></tr>`;
    } else {
      [...itemImports].reverse().forEach(imp => {
        const dateStr = imp.Ngay_Nhap ? new Date(imp.Ngay_Nhap).toLocaleString('vi-VN') : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span style="font-family: monospace; font-size: 0.8rem;">${imp.ID_Giao_Dich}</span></td>
          <td><span class="badge badge-success">+${imp.So_Luong} ${imp.Don_Vi || 'cái'}</span></td>
          <td><span style="font-size: 0.8rem;">${dateStr}</span></td>
          <td><span class="badge badge-primary">${imp.Nguoi_Nhap || '-'}</span></td>
          <td><span style="font-size: 0.8rem; color: var(--text-muted);">${imp.Ghi_Chu || '-'}</span></td>
        `;
        importTbody.appendChild(tr);
      });
    }
  }

  // 3. Render lịch sử xuất kho của vật tư này
  const exportTbody = document.getElementById('item-export-history-tbody');
  if (exportTbody) {
    exportTbody.innerHTML = '';
    const itemExports = (appData.exports || []).filter(exp => exp.ID_Vat_Tu === itemId);
    if (itemExports.length === 0) {
      exportTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Chưa có lịch sử xuất kho cho vật tư này.</td></tr>`;
    } else {
      [...itemExports].reverse().forEach(exp => {
        const dateStr = exp.Ngay_Xuat ? new Date(exp.Ngay_Xuat).toLocaleString('vi-VN') : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span style="font-family: monospace; font-size: 0.8rem;">${exp.ID_Giao_Dich}</span></td>
          <td><span class="badge badge-danger">-${exp.So_Luong} ${exp.Don_Vi || 'cái'}</span></td>
          <td><span class="badge badge-primary">${exp.Nguoi_Nhan || '-'}</span></td>
          <td><span style="font-size: 0.8rem;">${exp.Muc_Dich || '-'}</span></td>
          <td><span style="font-size: 0.8rem;">${dateStr}</span></td>
          <td><span style="font-size: 0.8rem; color: var(--text-muted);">${exp.Ghi_Chu || '-'}</span></td>
        `;
        exportTbody.appendChild(tr);
      });
    }
  }

  // 4. Render nhật ký chỉnh sửa thông tin của vật tư này
  const editTbody = document.getElementById('item-edit-logs-tbody');
  if (editTbody) {
    editTbody.innerHTML = '';
    const itemEdits = (appData.editLogs || []).filter(log => log.ID_Vat_Tu === itemId);
    if (itemEdits.length === 0) {
      editTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Chưa có lịch sử sửa đổi cho vật tư này.</td></tr>`;
    } else {
      [...itemEdits].reverse().forEach(log => {
        const dateStr = log.Ngay_Chinh_Sua ? new Date(log.Ngay_Chinh_Sua).toLocaleString('vi-VN') : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span style="font-family: monospace; font-size: 0.8rem;">${log.ID_Log}</span></td>
          <td><span style="font-size: 0.8rem; color: var(--text-muted);">${log.Chi_Tiet}</span></td>
          <td><span style="font-size: 0.8rem;">${dateStr}</span></td>
          <td><span class="badge badge-primary">${log.Nguoi_Sua || 'Admin'}</span></td>
        `;
        editTbody.appendChild(tr);
      });
    }
  }

  // Hiển thị modal
  const modal = document.getElementById('item-history-modal-overlay');
  if (modal) {
    modal.classList.add('active');
  }
};

window.closeItemHistoryModal = function() {
  const modal = document.getElementById('item-history-modal-overlay');
  if (modal) {
    modal.classList.remove('active');
  }
  currentViewingItemId = null;
};

// Tăng giảm số lượng chọn nhanh trên dòng
window.adjustRowQty = function(itemId, change) {
  const input = document.getElementById(`row-qty-${itemId}`);
  if (!input) return;
  let val = parseInt(input.value) || 1;
  let min = parseInt(input.getAttribute('min')) || 1;
  let max = parseInt(input.getAttribute('max')) || Infinity;
  let newVal = val + change;
  if (newVal >= min && newVal <= max) {
    input.value = newVal;
  }
};

// --- QUẢN LÝ THAO TÁC GIỎ HÀNG (SHOPPING CART) ---
window.addToCart = function(itemId) {
  const item = appData.inventory.find(i => i.ID === itemId);
  if (!item) return;

  const rowQtyInput = document.getElementById(`row-qty-${itemId}`);
  const qtyToAdd = rowQtyInput ? parseInt(rowQtyInput.value) : 1;

  if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
    showToast('Số lượng cần thêm không hợp lệ!', 'danger');
    return;
  }

  if (currentRole === 'student') {
    const pendingReqs = (!appData.requests ? [] : appData.requests).filter(req => 
      req.Trang_Thai === 'Cho_Duyet' && 
      req.Nguoi_Yeu_Cau && 
      req.Nguoi_Yeu_Cau.toString().includes("Sinh viên")
    );
    const pendingGroupsCount = groupRequests(pendingReqs).length;
    if (pendingGroupsCount >= 8) {
      showToast('Bạn đã đạt tối đa 8 lượt yêu cầu đang chờ duyệt. Vui lòng đợi phê duyệt hoặc hủy bớt lô cũ!', 'danger');
      return;
    }
  }

  if (currentRole !== 'student' && qtyToAdd > item.So_Luong) {
    showToast('Số lượng thêm vượt quá tồn kho thực tế!', 'danger');
    return;
  }

  const existingCartItem = cart.find(c => c.itemId === itemId);
  if (existingCartItem) {
    existingCartItem.qty = currentRole === 'student' ? qtyToAdd : Math.min(qtyToAdd, item.So_Luong);
  } else {
    cart.push({
      itemId: item.ID,
      code: item.Ma_So || '',
      name: item.Ten,
      brand: item.Hang || '',
      spec: item.Quy_Cach || '',
      qty: qtyToAdd,
      unit: item.Don_Vi || 'Cái',
      maxQty: currentRole === 'student' ? 9999 : item.So_Luong,
      selected: true
    });
  }

  saveCart();
  updateCartBadge();
  showToast(`Đã thêm ${qtyToAdd} ${item.Don_Vi} "${item.Ten}" vào giỏ hàng thành công!`, 'success');
};

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  
  if (cart.length > 0) {
    badge.innerText = cart.length;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function renderCart() {
  const tbody = document.getElementById('cart-table-body');
  const formArea = document.getElementById('cart-checkout-form');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Giỏ hàng trống. Quay lại tab Tồn Kho để thêm vật tư!</td></tr>`;
    if (formArea) formArea.style.display = 'none';
    return;
  }

  if (formArea) {
    formArea.style.display = 'block';
    
    const btn = document.getElementById('cart-submit-btn');
    if (btn) {
      if (currentRole === 'staff' || currentRole === 'student') {
        btn.innerText = '📋 Gửi yêu cầu xuất kho';
        btn.className = 'btn btn-primary';
      } else {
        btn.innerText = '📤 Xác nhận xuất kho (Admin/Người xuất)';
        btn.className = 'btn btn-danger';
      }
    }
  }

  cart.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center;">
        <input type="checkbox" class="cart-item-checkbox" data-index="${index}" ${item.selected ? 'checked' : ''} style="width: 16px; height: 16px; cursor: pointer;" onchange="toggleCartItemSelection(${index})">
      </td>
      <td><span style="font-family: monospace; font-size: 0.85rem;">${item.code || '-'}</span></td>
      <td><strong>${item.name}</strong></td>
      <td>${item.spec} | ${item.brand}</td>
      <td>
        <div class="qty-control-sm">
          <button type="button" class="qty-btn-sm" onclick="adjustCartQty(${index}, -1)">-</button>
          <input type="number" class="qty-input-sm" id="cart-qty-${index}" value="${item.qty}" min="1" max="${item.maxQty}" onchange="changeCartQty(${index}, this.value)">
          <button type="button" class="qty-btn-sm" onclick="adjustCartQty(${index}, 1)">+</button>
        </div>
      </td>
      <td>${item.unit}</td>
      <td style="text-align: right;">
        <button class="btn btn-danger" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="removeFromCart(${index})">Xóa 🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const selectAll = document.getElementById('cart-select-all');
  if (selectAll) {
    selectAll.checked = cart.every(c => c.selected);
    selectAll.onclick = () => {
      const isChecked = selectAll.checked;
      cart.forEach(c => c.selected = isChecked);
      saveCart();
      renderCart();
    };
  }
}

window.toggleCartItemSelection = function(index) {
  if (cart[index]) {
    cart[index].selected = !cart[index].selected;
  }
  const selectAll = document.getElementById('cart-select-all');
  if (selectAll) selectAll.checked = cart.every(c => c.selected);
  saveCart();
};

window.adjustCartQty = function(index, change) {
  if (!cart[index]) return;
  let newVal = cart[index].qty + change;
  if (newVal >= 1 && newVal <= cart[index].maxQty) {
    cart[index].qty = newVal;
    saveCart();
    renderCart();
  }
};

window.changeCartQty = function(index, value) {
  if (!cart[index]) return;
  let val = parseInt(value) || 1;
  cart[index].qty = Math.min(Math.max(val, 1), cart[index].maxQty);
  saveCart();
  renderCart();
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast('Đã xóa vật tư khỏi giỏ hàng.', 'primary');
};

// --- XỬ LÝ SUBMIT TOÀN BỘ GIỎ HÀNG ---
async function handleCartCheckoutSubmit(e) {
  e.preventDefault();

  const selectedItems = cart.filter(c => c.selected);
  if (selectedItems.length === 0) {
    showToast('Vui lòng tích chọn ít nhất 1 vật tư trong giỏ để xuất!', 'danger');
    return;
  }

  const recipient = document.getElementById('cart-recipient').value.trim();
  let purpose = document.getElementById('cart-purpose').value.trim();
  const purposeCustom = document.getElementById('cart-purpose-custom').value.trim();
  if (purposeCustom) purpose = purposeCustom;
  const note = document.getElementById('cart-note').value.trim();

  if (!recipient) {
    showToast('Họ tên người nhận bắt buộc nhập!', 'danger');
    return;
  }

  showLoading(true);

  const isRequestMode = currentRole === 'staff' || currentRole === 'student';

  if (isRequestMode) {
    if (currentRole === 'student') {
      const pendingReqs = (!appData.requests ? [] : appData.requests).filter(req => 
        req.Trang_Thai === 'Cho_Duyet' && 
        req.Nguoi_Yeu_Cau && 
        req.Nguoi_Yeu_Cau.toString().includes("Sinh viên")
      );
      const pendingGroupsCount = groupRequests(pendingReqs).length;
      if (pendingGroupsCount >= 8) {
        showToast('Bạn đã đạt tối đa 8 lượt yêu cầu đang chờ duyệt. Vui lòng đợi phê duyệt hoặc hủy bớt lô cũ!', 'danger');
        showLoading(false);
        return;
      }
    }
    const finalRecipient = currentRole === 'student' ? ("Sinh viên của " + recipient) : recipient;
    const payload = {
      action: 'bulk_request_export',
      items: selectedItems,
      recipient: finalRecipient,
      purpose: purpose || 'Yêu cầu sử dụng',
      note: note,
      date: new Date().toISOString(),
      pin: currentRole === 'staff' ? appConfig.staffPin : appConfig.studentPin
    };

    try {
      const json = await sendRequest(payload);
      if (json.success) {
        showToast('Đã gửi toàn bộ giỏ hàng lên hệ thống phê duyệt!', 'success');
        cart = cart.filter(c => !c.selected);
        saveCart();
        updateCartBadge();
        document.getElementById('cart-action-form').reset();
        await loadData();
        switchTab('inventory');
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Supabase lỗi. Ghi nhận yêu cầu cục bộ.', 'warning');
      executeBulkRequestLocally(selectedItems, finalRecipient, purpose, note);
    }
  } else {
    let successCount = 0;
    const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.exporterPin;
    const userRoleName = currentRole === 'admin' ? 'Admin' : 'Người xuất kho';

    for (let k = 0; k < selectedItems.length; k++) {
      const target = selectedItems[k];
      const payload = {
        action: 'export',
        itemId: target.itemId,
        qty: target.qty,
        recipient: recipient,
        purpose: purpose,
        note: note,
        date: new Date().toISOString(),
        pin: pinSecret,
        user: userRoleName
      };

      try {
        const json = await sendRequest(payload);
        if (json.success) {
          successCount++;
        } else {
          throw new Error(json.message);
        }
      } catch (err) {
        console.error(err);
        const item = appData.inventory.find(i => i.ID === target.itemId);
        if (item) {
          item.So_Luong -= target.qty;
          const exportId = 'XK' + Date.now().toString().slice(-6) + k;
          appData.exports.push({
            ID_Giao_Dich: exportId,
            ID_Vat_Tu: item.ID,
            Ten: item.Ten,
            Hang: item.Hang,
            Quy_Cach: item.Quy_Cach,
            So_Luong: target.qty,
            Don_Vi: item.Don_Vi || 'cái',
            Ngay_Xuat: new Date().toISOString(),
            Nguoi_Nhan: recipient,
            Muc_Dich: purpose,
            Nguoi_Xuat: userRoleName,
            Ghi_Chu: note
          });
          successCount++;
        }
      }
    }

    saveMockData();

    // Nếu người dùng chọn xuất chuyển vào Tủ Hóa Chất Dùng Chung
    const isToSharedCabinet = document.getElementById('cart-is-shared-cabinet') && document.getElementById('cart-is-shared-cabinet').checked;
    const sharedLocation = (document.getElementById('cart-shared-location') ? document.getElementById('cart-shared-location').value.trim() : '') || 'Tủ dùng chung A';
    const sharedRemain = document.getElementById('cart-shared-remain') ? document.getElementById('cart-shared-remain').value.trim() : '';

    if (isToSharedCabinet && typeof addToSharedCabinet === 'function') {
      selectedItems.forEach(target => {
        const item = appData.inventory.find(i => i.ID === target.itemId);
        addToSharedCabinet({
          id_vat_tu: target.itemId,
          ten: target.name || (item ? item.Ten : ''),
          hang: target.brand || (item ? item.Hang : ''),
          quy_cach: target.spec || (item ? item.Quy_Cach : ''),
          don_vi: target.unit || (item ? item.Don_Vi : 'Chai'),
          vi_tri_tu: sharedLocation,
          so_luong: target.qty || 1,
          khoi_luong_con_lai: sharedRemain || (item ? `${item.Quy_Cach || ''} (đã mở)` : 'Còn dở'),
          nguoi_dua_vao: userRoleName,
          ghi_chu: note ? `Xuất đưa vào tủ dùng chung: ${note}` : 'Đưa vào tủ dùng chung sau khi xuất kho'
        });
      });
      showToast('Đã tự động chuyển các mặt hàng xuất vào Tủ Hóa Chất Dùng Chung!', 'success');
    }

    showToast(`Đã xuất kho thành công ${successCount}/${selectedItems.length} mặt hàng!`, 'success');
    cart = cart.filter(c => !c.selected);
    saveCart();
    updateCartBadge();
    document.getElementById('cart-action-form').reset();
    const scFields = document.getElementById('cart-shared-cabinet-fields');
    if (scFields) scFields.style.display = 'none';
    await loadData();
    switchTab('inventory');
  }

  showLoading(false);
}

function executeBulkRequestLocally(selectedItems, recipient, purpose, note) {
  selectedItems.forEach((target, k) => {
    const reqId = 'YC' + Date.now().toString().slice(-6) + k;
    appData.requests.push({
      ID_Yeu_Cau: reqId,
      ID_Vat_Tu: target.itemId,
      Ten: target.name,
      Hang: target.brand,
      Quy_Cach: target.spec,
      So_Luong_Yeu_Cau: target.qty,
      Don_Vi: target.unit,
      Nguoi_Yeu_Cau: recipient,
      Muc_Dich: purpose,
      Ngay_Yeu_Cau: new Date().toISOString(),
      Trang_Thai: 'Cho_Duyet',
      Ghi_Chu: note
    });
  });
  saveMockData();
  showToast('Đã lưu cục bộ toàn bộ yêu cầu xuất kho!', 'success');
  cart = cart.filter(c => !c.selected);
  saveCart();
  updateCartBadge();
  document.getElementById('cart-action-form').reset();
  renderCart();
  switchTab('inventory');
}

// --- RENDER DANH SÁCH LỊCH SỬ CHO QUYỀN ADMIN ---
function renderMyRequests() {
  const tbody = document.getElementById('my-requests-table-body');
  if (!tbody || !appData) return;

  tbody.innerHTML = '';
  const isStudent = currentRole === 'student';
  const requestsToRender = (!appData.requests ? [] : appData.requests).filter(req => {
    if (isStudent) {
      // Chỉ hiển thị yêu cầu của sinh viên
      return req.Nguoi_Yeu_Cau && req.Nguoi_Yeu_Cau.toString().includes("Sinh viên");
    }
    return true;
  });

  const grouped = groupRequests(requestsToRender);
  grouped.sort((a, b) => {
    const aPending = a.Trang_Thai === 'Cho_Duyet';
    const bPending = b.Trang_Thai === 'Cho_Duyet';
    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
    return new Date(b.Ngay_Yeu_Cau).getTime() - new Date(a.Ngay_Yeu_Cau).getTime();
  });

  if (grouped.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Chưa gửi yêu cầu xuất nào.</td></tr>`;
    return;
  }

  grouped.forEach(group => {
    let statusBadge = '';
    if (group.Trang_Thai === 'Cho_Duyet') {
      statusBadge = '<span class="badge badge-warning">Đang chờ duyệt</span>';
    } else if (group.Trang_Thai === 'Da_Duyet') {
      statusBadge = '<span class="badge badge-success">Đã duyệt</span>';
    } else if (group.Trang_Thai === 'Da_Huy') {
      statusBadge = '<span class="badge badge-secondary">Đã hủy</span>';
    } else {
      statusBadge = `<span class="badge badge-danger" title="${escapeHtml(group.Ly_Do_Tu_Choi || 'Từ chối')}">Từ chối</span>`;
    }

    const dateStr = group.Ngay_Yeu_Cau ? new Date(group.Ngay_Yeu_Cau).toLocaleString('vi-VN') : '-';

    // Điều kiện hủy: đang chờ duyệt và gửi chưa quá 20 phút
    const requestTime = group.Ngay_Yeu_Cau ? new Date(group.Ngay_Yeu_Cau).getTime() : 0;
    const isCancellable = group.Trang_Thai === 'Cho_Duyet' && (Date.now() - requestTime) < 20 * 60 * 1000;
    
    const reqIdsStr = group.items.map(it => it.ID_Yeu_Cau).join(',');
    const cancelBtnHtml = isCancellable ? 
      `<button class="btn btn-danger btn-sm" onclick="cancelMyRequest('${reqIdsStr}')" style="padding: 0.15rem 0.35rem; font-size: 0.7rem; border-radius: 4px; border: none;" title="Hủy nhóm yêu cầu">❌ Hủy</button>` : 
      `<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>`;

    // Vẽ danh sách vật tư dạng bảng con để căn chỉnh hoàn hảo
    const subTableHtml = `
      <td style="padding: 0;">
        <table style="width: 100%; border-collapse: collapse; background: transparent; margin: 0;">
          <tbody>
            ${group.items.map((it, idx) => `
              <tr style="border-bottom: 1px solid var(--border); background: transparent;">
                <td style="padding: 0.5rem; border: none; font-size: 0.85rem;">
                  <strong>${idx + 1}. ${escapeHtml(it.Ten)}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">
                    (${escapeHtml(it.Hang || 'K/P')} - ${escapeHtml(it.Quy_Cach || 'K/P')})
                  </span>
                </td>
                <td style="padding: 0.5rem; border: none; width: 90px; text-align: right; font-weight: 600;">
                  ${it.So_Luong_Yeu_Cau} ${it.Don_Vi || 'Cái'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </td>
    `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      ${subTableHtml}
      <td>${escapeHtml(group.Nguoi_Yeu_Cau || '-')}</td>
      <td><span style="font-size: 0.85rem;">${dateStr}</span></td>
      <td>${statusBadge}</td>
      <td><span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(group.Ghi_Chu || '-')}</span></td>
      <td style="text-align: center; vertical-align: middle;">${cancelBtnHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.cancelMyRequest = async function(reqId) {
  const ids = reqId.split(',');
  const confirmMsg = ids.length > 1
    ? `Bạn có chắc chắn muốn hủy nhóm yêu cầu xuất kho này (${ids.length} mặt hàng)?`
    : 'Bạn có chắc chắn muốn hủy yêu cầu xuất kho này?';
  if (!confirm(confirmMsg)) {
    return;
  }
  showLoading(true);
  
  // Cập nhật giao diện cục bộ trước
  ids.forEach(id => {
    const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
    if (req) {
      req.Trang_Thai = 'Da_Huy';
    }
  });
  saveMockData();
  renderMyRequests();
  renderCancelledRequests();
  
  // Gửi lệnh lên Supabase
  const pinSecret = appConfig.staffPin || '';
  try {
    initSupabase();
    if (supabaseClient) {
      const { error } = await supabaseClient.from('yeu_cau_xuat').update({ trang_thai: 'Da_Huy' }).in('id_yeu_cau', ids);
      if (error) throw error;
    }
    await loadData();
  } catch(err) {
    console.error("Lỗi khi hủy nhóm yêu cầu:", err);
    showToast('Lỗi khi hủy yêu cầu: ' + err.message, 'danger');
  }
  showLoading(false);
};

function renderAdminRequests() {
  const tbody = document.getElementById('admin-requests-table-body');
  const batchActions = document.getElementById('batch-approve-actions');
  const selectAllCheckbox = document.getElementById('request-select-all');
  
  if (!tbody || !appData) return;

  tbody.innerHTML = '';
  
  // Render spec proposals first
  if (typeof renderSpecRequests === 'function') {
    renderSpecRequests();
  }

  const pendingRequests = (appData.requests || []).filter(r => r.Trang_Thai === 'Cho_Duyet');

  if (pendingRequests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">Không có yêu cầu xuất kho nào đang chờ duyệt.</td></tr>`;
    if (batchActions) batchActions.style.display = 'none';
    return;
  }

  // Sắp xếp yêu cầu theo thời gian tăng dần để so khớp gom nhóm
  pendingRequests.sort((a, b) => new Date(a.Ngay_Yeu_Cau) - new Date(b.Ngay_Yeu_Cau));

  // Gom nhóm các yêu cầu xuất kho của cùng 1 người gửi cách nhau dưới 60 giây
  const groups = [];
  pendingRequests.forEach(req => {
    const reqTime = new Date(req.Ngay_Yeu_Cau).getTime();
    let foundGroup = groups.find(g => {
      if (g.user !== req.Nguoi_Yeu_Cau) return false;
      const gTime = new Date(g.time).getTime();
      return Math.abs(reqTime - gTime) < 60000; // 60s
    });

    if (foundGroup) {
      foundGroup.items.push(req);
    } else {
      groups.push({
        user: req.Nguoi_Yeu_Cau,
        time: req.Ngay_Yeu_Cau,
        purpose: req.Muc_Dich || 'Yêu cầu sử dụng',
        items: [req]
      });
    }
  });

  // Render từng nhóm phiếu
  groups.forEach((group, gIdx) => {
    const dateObj = new Date(group.time);
    // Định dạng ngày giờ hiển thị chi tiết (ví dụ: 09:18:58 - 16/7/2026)
    const timeFormatted = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + dateObj.toLocaleDateString('vi-VN');
    
    const tr = document.createElement('tr');
    const itemIds = group.items.map(it => it.ID_Yeu_Cau).join(',');
    
    let itemsHtml = '';
    group.items.forEach(it => {
      let labelHtml = `<strong>${it.Ten}</strong> <span style="color: var(--text-muted); font-size: 0.75rem;">(${it.Quy_Cach || 'K/P'} | ${it.Hang || 'K/P'})</span>`;
      if (it.originalItemName) {
        labelHtml += ` <span class="badge badge-success" style="font-size:0.7rem; padding:0.15rem 0.3rem;" title="Yêu cầu gốc: ${it.originalItemName} (${it.originalItemBrand})">🔄 Đã thay thế</span>`;
      }
      
      const item = appData.inventory.find(i => i.ID === it.ID_Vat_Tu);
      const currentStock = item ? (parseFloat(item.So_Luong) || 0) : 0;
      const isOverStock = it.So_Luong_Yeu_Cau > currentStock;
      
      let overStockWarningHtml = '';
      if (isOverStock) {
        overStockWarningHtml = `<span style="color: var(--danger); font-weight: 600; font-size: 0.8rem; margin-left: 0.5rem;" title="Vượt quá tồn kho thực tế (Còn tồn: ${currentStock} ${it.Don_Vi || 'Cái'})">⚠️ (Tồn: ${currentStock})</span>`;
      }

      itemsHtml += `
        <div style="margin-bottom: 0.75rem; padding: 0.5rem; background: var(--bg-app); border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
          <div style="font-size: 0.85rem;">
            ${labelHtml}
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="quantity-control" style="max-width: 100px; height:28px;">
              <button type="button" class="qty-btn" style="height:28px; width:28px; font-size:0.75rem; line-height:26px;" onclick="adjustReqQty('${it.ID_Yeu_Cau}', -1)">-</button>
              <input type="number" id="approve-qty-${it.ID_Yeu_Cau}" class="qty-input" style="height:28px; width:44px; font-size: 0.8rem; padding:0;" value="${it.So_Luong_Yeu_Cau}" min="0.1" step="0.1">
              <button type="button" class="qty-btn" style="height:28px; width:28px; font-size:0.75rem; line-height:26px;" onclick="adjustReqQty('${it.ID_Yeu_Cau}', 1)">+</button>
            </div>
            <span style="font-size: 0.85rem; font-weight: 500;">${it.Don_Vi || 'Cái'}</span>
            ${overStockWarningHtml}
            <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.4rem; font-size: 0.7rem; color: var(--primary); border-color: var(--primary-pale);" onclick="openReplacementModal('${it.ID_Yeu_Cau}')">Thay thế 🔄</button>
            <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.4rem; font-size: 0.7rem; color: var(--danger);" onclick="rejectSingleRequest('${it.ID_Yeu_Cau}')">Xóa</button>
          </div>
        </div>
      `;
    });

    // Tạo dropdown chọn mục đích xuất từ appConfig.purposes
    const purposes = appConfig.purposes || [];
    let isCurrentInList = purposes.includes(group.purpose);
    let selectHtml = `<select id="group-purpose-${group.items[0].ID_Yeu_Cau}" class="form-control" style="font-size: 0.85rem; padding: 0.25rem 0.5rem; width: 170px; border: 1px solid var(--border); border-radius: 4px; background: var(--bg-card); color: var(--text); cursor: pointer;">`;
    if (!isCurrentInList && group.purpose) {
      selectHtml += `<option value="${group.purpose}" selected>${group.purpose}</option>`;
    }
    purposes.forEach(p => {
      const isSelected = p === group.purpose ? 'selected' : '';
      selectHtml += `<option value="${p}" ${isSelected}>${p}</option>`;
    });
    selectHtml += `</select>`;

    tr.innerHTML = `
      <td style="text-align: center; vertical-align: middle;">
        <input type="checkbox" class="group-select-checkbox" data-ids="${itemIds}" style="width: 16px; height: 16px; cursor: pointer;" onchange="updateBatchActionsVisibility()">
      </td>
      <td>
        <span style="font-size:0.75rem; color:var(--text-muted); font-family: monospace;">#${group.items[0].ID_Yeu_Cau.slice(0, 8)}</span>
        <br>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">⏱️ ${timeFormatted}</span>
      </td>
      <td><span class="badge badge-primary" style="font-size: 0.85rem; padding: 0.35rem 0.65rem;">${group.user}</span></td>
      <td>
        ${selectHtml}
      </td>
      <td>
        <div style="display: flex; flex-direction: column; gap: 0.25rem; max-width: 500px;">
          ${itemsHtml}
        </div>
      </td>
      <td style="text-align: right; vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end;">
          <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: 120px;" onclick="approveGroup('${itemIds}')">✅ Duyệt</button>
          <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; width: 120px;" onclick="rejectGroup('${itemIds}')">❌ Từ Chối</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Checkbox chọn tất cả
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.onclick = () => {
      const isChecked = selectAllCheckbox.checked;
      document.querySelectorAll('.group-select-checkbox').forEach(cb => {
        cb.checked = isChecked;
      });
      updateBatchActionsVisibility();
    };
  }
}

window.adjustReqQty = function(reqId, change) {
  const input = document.getElementById(`approve-qty-${reqId}`);
  if (!input) return;
  let val = parseFloat(input.value) || 0;
  if (val + change >= 0.1) {
    input.value = (val + change).toFixed(0);
  }
};

function renderHistory() {
  const importBody = document.getElementById('import-history-body');
  const exportBody = document.getElementById('export-history-body');

  if (!appData) return;

  // Render Dòng thời gian trước
  renderTimeline();

  if (importBody) {
    importBody.innerHTML = '';
    if (appData.imports.length === 0) {
      importBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Chưa có lịch sử nhập kho.</td></tr>`;
    } else {
      [...appData.imports].reverse().forEach(item => {
        const dateStr = item.Ngay_Nhap ? new Date(item.Ngay_Nhap).toLocaleString('vi-VN') : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${item.Ten}</strong></td>
          <td>${item.Hang}</td>
          <td>${item.Quy_Cach}</td>
          <td><span class="badge badge-success">+${item.So_Luong} ${item.Don_Vi}</span></td>
          <td><span style="font-size: 0.85rem;">${dateStr}</span></td>
          <td><span style="font-size: 0.85rem; color: var(--text-muted);">${item.Ghi_Chu || '-'}</span></td>
        `;
        importBody.appendChild(tr);
      });
    }
  }

  if (exportBody) {
    exportBody.innerHTML = '';
    if (appData.exports.length === 0) {
      exportBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Chưa có lịch sử xuất kho.</td></tr>`;
    } else {
      const groupedExps = groupExports(appData.exports);
      [...groupedExps].reverse().forEach(group => {
        const dateStr = group.Ngay_Xuat ? new Date(group.Ngay_Xuat).toLocaleString('vi-VN') : '-';
        
        const isExporterOrAdmin = currentRole === 'admin' || currentRole === 'exporter';
        const dateXuat = new Date(group.Ngay_Xuat || Date.now());
        const isUnderOneHour = (Date.now() - dateXuat.getTime()) < 3600000;
        
        const txIdsStr = group.items.map(it => it.ID_Giao_Dich).join(',');

        let undoBtnHtml = '';
        if (isExporterOrAdmin && isUnderOneHour) {
          undoBtnHtml = `<button class="btn btn-secondary btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.72rem; color: var(--danger); font-weight: 600;" onclick="undoExport('${txIdsStr}')">↩️ Hoàn tác</button>`;
        } else {
          undoBtnHtml = `<span style="font-size:0.75rem; color:var(--text-muted);">-</span>`;
        }

        // Vẽ bảng con lồng nhau cho Vật Tư và Số lượng xuất để căn chỉnh hoàn hảo từng hàng
        const subTableHtml = `
          <td style="padding: 0;">
            <table style="width: 100%; border-collapse: collapse; background: transparent; margin: 0;">
              <tbody>
                ${group.items.map((it, idx) => `
                  <tr style="border-bottom: 1px solid var(--border); background: transparent;">
                    <td style="padding: 0.5rem; border: none; font-size: 0.85rem;">
                      <strong>${idx + 1}. ${escapeHtml(it.Ten)}</strong>
                      <span style="font-size: 0.8rem; color: var(--text-muted);">
                        (${escapeHtml(it.Hang || 'K/P')} - ${escapeHtml(it.Quy_Cach || 'K/P')})
                      </span>
                    </td>
                    <td style="padding: 0.5rem; border: none; width: 95px; text-align: right;">
                      <span class="badge badge-danger">-${it.So_Luong} ${it.Don_Vi || 'Cái'}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          ${subTableHtml}
          <td><span class="badge badge-primary">${escapeHtml(group.Nguoi_Nhan)}</span></td>
          <td><span style="font-size: 0.85rem;">${escapeHtml(group.Muc_Dich)}</span></td>
          <td><span style="font-size: 0.85rem;">${dateStr}</span></td>
          <td><span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(group.Ghi_Chu || '-')}</span></td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-primary btn-sm" style="padding: 0.25rem 0.55rem; font-size: 0.72rem; margin-right: 0.35rem;" onclick="openPrintExportModal('${txIdsStr}')">🖨️ In Phiếu</button>
            ${undoBtnHtml}
          </td>
        `;
        exportBody.appendChild(tr);
      });
    }
  }

  // Render danh sách yêu cầu bị từ chối để Admin theo dõi
  renderAdminRejectedRequests();
}

function renderAdminRejectedRequests() {
  const tbody = document.getElementById('admin-rejected-requests-body');
  if (!tbody || !appData) return;

  tbody.innerHTML = '';
  const rejected = (appData.requests || []).filter(r => r.Trang_Thai === 'Tu_Choi' || r.Trang_Thai === 'Da_Doc_Tu_Choi');

  if (rejected.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Không có yêu cầu xuất kho nào bị từ chối.</td></tr>`;
    return;
  }

  [...rejected].reverse().forEach(req => {
    const timeFormatted = req.Ngay_Yeu_Cau ? new Date(req.Ngay_Yeu_Cau).toLocaleString('vi-VN') : '-';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="font-family: monospace; font-size:0.75rem;">#${req.ID_Yeu_Cau.slice(0, 8)}</span><br><span style="font-size:0.7rem; color:var(--text-muted);">${timeFormatted}</span></td>
      <td><span class="badge badge-primary">${req.Nguoi_Yeu_Cau}</span></td>
      <td><strong>${req.Ten}</strong></td>
      <td>${req.Quy_Cach || 'K/P'} | ${req.Hang || 'K/P'}</td>
      <td><span class="badge badge-danger">${req.So_Luong_Yeu_Cau} ${req.Don_Vi || 'Cái'}</span></td>
      <td><span style="font-size: 0.8rem;">${req.Muc_Dich || '-'}</span></td>
      <td><span style="color: var(--danger); font-size: 0.85rem; font-weight: 500;">❌ ${req.Ghi_Chu || 'Không phê duyệt'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- RENDER NHẬT KÝ SỬA ĐỔI THÔNG TIN VẬT TƯ (CHỈ ADMIN) ---
function renderEditLogs() {
  const tbody = document.getElementById('edit-logs-table-body');
  if (!tbody || !appData) return;

  tbody.innerHTML = '';
  const logs = appData.editLogs || [];

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1rem;">Không có nhật ký chỉnh sửa thông tin nào.</td></tr>`;
    return;
  }

  [...logs].reverse().forEach(log => {
    const dateStr = log.Ngay_Chinh_Sua ? new Date(log.Ngay_Chinh_Sua).toLocaleString('vi-VN') : '-';
    
    let detailText = '';
    let isRollbackable = false;
    
    try {
      let parsed = log.Chi_Tiet;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && typeof parsed === 'object') {
        detailText = parsed.formatted || '';
        if (parsed.oldValues && Object.keys(parsed.oldValues).length > 0) {
          isRollbackable = true;
        }
      } else {
        detailText = log.Chi_Tiet || '';
      }
    } catch(e) {
      detailText = log.Chi_Tiet || '';
      if (typeof log.Chi_Tiet === 'string' && log.Chi_Tiet.includes('->')) {
        isRollbackable = true;
      }
    }

    // Kiểm tra xem ID vật tư có còn tồn tại trong kho không
    const itemExists = appData.inventory.some(i => i.ID === log.ID_Vat_Tu);
    
    let rollbackBtnHtml = '';
    const isAdmin = currentRole === 'admin';
    if (isAdmin) {
      if (isRollbackable && itemExists) {
        rollbackBtnHtml = `<button class="btn btn-secondary btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.72rem; color: var(--primary); font-weight: 600;" onclick="rollbackEdit('${log.ID_Log}')">↩️ Khôi phục</button>`;
      } else if (!itemExists) {
        rollbackBtnHtml = `<span style="font-size:0.75rem; color:var(--text-muted);">Đã xóa khỏi kho</span>`;
      } else {
        rollbackBtnHtml = `<span style="font-size:0.75rem; color:var(--text-muted);">-</span>`;
      }
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="font-family: monospace; font-size: 0.85rem;">${log.ID_Log}</span></td>
      <td><span style="font-family: monospace; font-size: 0.85rem; color: var(--text-muted);">${log.ID_Vat_Tu}</span></td>
      <td><strong>${log.Ten_Vat_Tu}</strong></td>
      <td><span style="font-size: 0.85rem; color: var(--text-muted);">${detailText}</span></td>
      <td><span style="font-size: 0.85rem;">${dateStr}</span></td>
      <td><span class="badge badge-primary">${log.Nguoi_Sua || 'Admin'}</span></td>
      <td style="text-align: right;" class="admin-only-cell">${rollbackBtnHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- XUẤT FILE EXCEL BẠO CÁO THEO TUẦN/THÁNG/NĂM ---
function exportHistoryToExcel() {
  if (!appData) return;
  const filter = document.getElementById('report-time-filter').value;
  const now = new Date();
  
  const isWithinPeriod = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    if (filter === 'all') return true;
    
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (filter === 'week') return diffDays <= 7;
    if (filter === 'month') return diffDays <= 30;
    if (filter === 'year') return date.getFullYear() === now.getFullYear();
    
    return true;
  };

  const filteredImports = appData.imports.filter(i => isWithinPeriod(i.Ngay_Nhap));
  const filteredExports = appData.exports.filter(e => isWithinPeriod(e.Ngay_Xuat));

  if (filteredImports.length === 0 && filteredExports.length === 0) {
    showToast('Không tìm thấy bản ghi lịch sử nào trong chu kỳ đã chọn để xuất!', 'warning');
    return;
  }

  const importRows = filteredImports.map(i => ({
    'Mã Giao Dịch': i.ID_Giao_Dich,
    'Mã Vật Tư': i.ID_Vat_Tu,
    'Tên Vật Tư': i.Ten,
    'Xuất Xứ/Hãng': i.Hang,
    'Quy Cách': i.Quy_Cach,
    'Số Lượng Nhập': i.So_Luong,
    'Đơn Vị': i.Don_Vi,
    'Ngày Nhập': i.Ngay_Nhap ? new Date(i.Ngay_Nhap).toLocaleString('vi-VN') : '',
    'Người Nhập': i.Nguoi_Nhap,
    'Ghi Chú': i.Ghi_Chu || ''
  }));

  const exportRows = filteredExports.map(e => ({
    'Mã Giao Dịch': e.ID_Giao_Dich,
    'Mã Vật Tư': e.ID_Vat_Tu,
    'Tên Vật Tư': e.Ten,
    'Hãng/Quy Cách': `${e.Hang || ''} | ${e.Quy_Cach || ''}`,
    'Số Lượng Xuất': e.So_Luong,
    'Đơn Vị': e.Don_Vi,
    'Ngày Xuất': e.Ngay_Xuat ? new Date(e.Ngay_Xuat).toLocaleString('vi-VN') : '',
    'Người Nhận': e.Nguoi_Nhan,
    'Mục Đích': e.Muc_Dich,
    'Người Thực Hiện': e.Nguoi_Xuat,
    'Ghi Chú': e.Ghi_Chu || ''
  }));

  try {
    const wb = XLSX.utils.book_new();
    
    const wsImports = XLSX.utils.json_to_sheet(importRows);
    XLSX.utils.book_append_sheet(wb, wsImports, 'Lịch sử Nhập Kho');
    
    const wsExports = XLSX.utils.json_to_sheet(exportRows);
    XLSX.utils.book_append_sheet(wb, wsExports, 'Lịch sử Xuất Kho');

    const filterText = filter === 'week' ? 'Tuan' : filter === 'month' ? 'Thang' : filter === 'year' ? 'Nam' : 'ToanBo';
    XLSX.writeFile(wb, `Bao_Cao_Kho_Lab_${filterText}_${now.getFullYear()}.xlsx`);
    showToast('Tải báo cáo Excel thành công!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Lỗi xuất Excel: ' + err.message, 'danger');
  }
}

// --- ADMIN: DUYỆT / TỪ CHỐI YÊU CẦU XUẤT ---
window.approveRequest = async function(reqId) {
  const qtyInput = document.getElementById(`approve-qty-${reqId}`);
  if (!qtyInput) return;
  const qty = parseFloat(qtyInput.value);

  if (isNaN(qty) || qty <= 0) {
    showToast('Số lượng duyệt không hợp lệ!', 'danger');
    return;
  }

  const req = appData.requests.find(r => r.ID_Yeu_Cau === reqId);
  if (!req) return;

  const item = appData.inventory.find(i => i.ID === req.ID_Vat_Tu);
  if (!item || item.So_Luong < qty) {
    showToast('Tồn kho thực tế không đủ duyệt!', 'danger');
    return;
  }

  const note = prompt("Nhập ghi chú duyệt (nếu có):") || "";
  showLoading(true);

  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : (currentRole === 'importer' ? appConfig.importerPin : appConfig.exporterPin);
  const payload = {
    action: 'approve_export',
    requestId: reqId,
    qty: qty,
    note: req.replacementItemId ? `Duyệt thay thế hóa chất. ${note}` : note,
    pin: pinSecret
  };
  if (req.replacementItemId) {
    payload.replacementItemId = req.replacementItemId;
  }

  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Đã duyệt cấp phát thành công!', 'success');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    console.error(error);
    showToast('Supabase lỗi. Phê duyệt cục bộ.', 'warning');
    executeApproveLocally(reqId, qty, note, item);
  }

  showLoading(false);
};

function executeApproveLocally(reqId, qty, note, item, customPurpose) {
  const req = appData.requests.find(r => r.ID_Yeu_Cau === reqId);
  if (!req) return;

  if (customPurpose) {
    req.Muc_Dich = customPurpose;
  }

  item.So_Luong -= qty;
  req.Trang_Thai = 'Da_Duyet';
  req.So_Luong_Yeu_Cau = qty;
  req.Ghi_Chu = note;

  const exportId = 'XK' + Date.now().toString().slice(-6);
  appData.exports.push({
    ID_Giao_Dich: exportId,
    ID_Vat_Tu: item.ID,
    Ten: item.Ten,
    Hang: item.Hang,
    Quy_Cach: item.Quy_Cach,
    So_Luong: qty,
    Don_Vi: item.Don_Vi || 'cái',
    Ngay_Xuat: new Date().toISOString(),
    Nguoi_Nhan: req.Nguoi_Yeu_Cau,
    Muc_Dich: req.Muc_Dich,
    Nguoi_Xuat: currentRole === 'admin' ? 'Admin' : (currentRole === 'importer' ? 'Người nhập kho' : 'Người xuất kho'),
    Ghi_Chu: `Duyệt yêu cầu ${reqId}. ` + note
  });

  saveMockData();
  showToast('Đã duyệt cấp cục bộ!', 'success');
  
  renderInventory();
  renderAdminRequests();
  renderHistory();
}

window.rejectRequest = async function(reqId) {
  const note = prompt("Nhập lý do từ chối:") || "";
  showLoading(true);

  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : (currentRole === 'importer' ? appConfig.importerPin : appConfig.exporterPin);
  const payload = {
    action: 'reject_export',
    requestId: reqId,
    note: note,
    pin: pinSecret
  };

  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Từ chối thành công!', 'success');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    console.error(error);
    showToast('Lỗi Supabase. Xử lý cục bộ.', 'warning');
    executeRejectLocally(reqId, note);
  }

  showLoading(false);
};

function executeRejectLocally(reqId, note) {
  const req = appData.requests.find(r => r.ID_Yeu_Cau === reqId);
  if (req) {
    req.Trang_Thai = 'Tu_Choi';
    req.Ghi_Chu = note;
    saveMockData();
    showToast('Từ chối yêu cầu thành công!', 'primary');
    renderAdminRequests();
  }
}

// --- NHẬP KHO TRỰC TIẾP ---
async function handleImportSubmit(e) {
  e.preventDefault();

  const code = document.getElementById('import-code').value.trim();
  const name = document.getElementById('import-name').value.trim();
  
  let brand = document.getElementById('import-brand').value.trim();
  const brandCustom = document.getElementById('import-brand-custom').value.trim();
  if (brandCustom) brand = brandCustom;

  let spec = document.getElementById('import-spec').value.trim();
  const specCustom = document.getElementById('import-spec-custom').value.trim();
  if (specCustom) spec = specCustom;

  let location = document.getElementById('import-location').value.trim();
  const locationCustom = document.getElementById('import-location-custom') ? document.getElementById('import-location-custom').value.trim() : '';
  if (locationCustom) location = locationCustom;

  // Tự động lưu vị trí bảo quản mới vào danh mục nếu chưa có
  if (location && appConfig.locations && !appConfig.locations.includes(location)) {
    appConfig.locations.push(location);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
    fillSelect('import-location', appConfig.locations);
    const mergedLocs = [...new Set([...(appConfig.locations || []), ...appData.inventory.map(i => i.Noi_Bao_Quan).filter(Boolean)])];
    fillDatalist('list-locations', mergedLocs);
  }

  let unit = document.getElementById('import-unit').value.trim();
  const unitCustom = document.getElementById('import-unit-custom').value.trim();
  if (unitCustom) unit = unitCustom;

  const qty = parseFloat(document.getElementById('import-qty').value);
  const expiry = document.getElementById('import-expiry').value;
  let year = document.getElementById('import-year').value.trim();
  if (!year) year = new Date().getFullYear().toString();
  const note = document.getElementById('import-note').value.trim();

  if (!name || isNaN(qty) || qty <= 0) {
    showToast('Vui lòng nhập thông tin hợp lệ!', 'danger');
    return;
  }

  const customFieldsData = {};
  const customFields = appConfig.customFields || [];
  customFields.forEach(cf => {
    const input = document.getElementById(`import-cf-${cf.key}`);
    if (input) {
      customFieldsData[cf.key] = input.value.trim();
    }
  });

  const techSpecsObj = {
    specText: '',
    customFields: customFieldsData
  };

  const newItem = {
    id: 'IMP' + Date.now() + Math.floor(Math.random() * 100),
    code: code,
    name: name,
    brand: brand || '',
    spec: spec || '',
    location: location,
    qty: qty,
    unit: unit || 'Cái',
    expiry: expiry,
    importYear: year,
    note: note,
    techSpecs: JSON.stringify(techSpecsObj)
  };

  importCart.push(newItem);
  localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
  
  showToast('Đã thêm hóa chất vào rổ hàng chờ nhập!', 'success');
  
  // Reset toàn bộ form nhập kho để tiếp tục nhập mới
  document.getElementById('import-form').reset();
  renderDynamicCustomFieldInputs(); // Reset các trường nhập tùy chọn
  
  renderImportCart();
}

function saveImportLocally(payload) {
  let item = appData.inventory.find(i => 
    i.Ten.toLowerCase() === payload.name.toLowerCase() &&
    i.Hang.toLowerCase() === payload.brand.toLowerCase() &&
    i.Quy_Cach.toLowerCase() === payload.spec.toLowerCase()
  );

  const userRoleStr = currentRole === 'admin' ? 'Admin' : 'Người nhập kho';

  if (item) {
    item.So_Luong += payload.qty;
    item.Ma_So = payload.code || item.Ma_So;
    item.Noi_Bao_Quan = payload.location || item.Noi_Bao_Quan;
    item.Don_Vi = payload.unit;
    item.Han_Su_Dung = payload.expiry || item.Han_Su_Dung;
    item.Nam_Nhap = payload.importYear || item.Nam_Nhap;
    item.Ghi_Chu = payload.note;
  } else {
    const newItem = {
      ID: 'VT' + Date.now().toString().slice(-6),
      Ma_So: payload.code,
      Ten: payload.name,
      Hang: payload.brand,
      Quy_Cach: payload.spec,
      Noi_Bao_Quan: payload.location,
      So_Luong: payload.qty,
      Don_Vi: payload.unit,
      Han_Su_Dung: payload.expiry,
      Nam_Nhap: payload.importYear,
      Ghi_Chu: payload.note
    };
    appData.inventory.push(newItem);
    payload.itemId = newItem.ID;
  }

  const importId = 'NK' + Date.now().toString().slice(-6);
  appData.imports.push({
    ID_Giao_Dich: importId,
    ID_Vat_Tu: payload.itemId || item.ID,
    Ten: payload.name,
    Hang: payload.brand,
    Quy_Cach: payload.spec,
    So_Luong: payload.qty,
    Don_Vi: payload.unit,
    Ngay_Nhap: payload.date,
    Nguoi_Nhap: userRoleStr,
    Ghi_Chu: payload.note
  });

  saveMockData();
  showToast('Lưu phiếu nhập kho cục bộ thành công!', 'success');
  document.getElementById('import-form').reset();
  
  populateDropdowns();
  renderInventory();
  renderHistory();
}

// --- ADMIN: XUẤT KHO TRỰC TIẾP FORM ---
async function handleExportSubmit(e) {
  e.preventDefault();

  const itemId = document.getElementById('export-item-id').value;
  const qty = parseFloat(document.getElementById('export-qty').value);
  
  let recipient = document.getElementById('export-recipient').value.trim();
  const recipientCustom = document.getElementById('export-recipient-custom').value.trim();
  if (recipientCustom) recipient = recipientCustom;

  let purpose = document.getElementById('export-purpose').value.trim();
  const purposeCustom = document.getElementById('export-purpose-custom').value.trim();
  if (purposeCustom) purpose = purposeCustom;

  const note = document.getElementById('export-note').value.trim();

  if (!itemId || isNaN(qty) || qty <= 0) {
    showToast('Thông tin xuất kho không hợp lệ!', 'danger');
    return;
  }

  const item = appData.inventory.find(i => i.ID === itemId);
  if (!item || item.So_Luong < qty) {
    showToast('Số lượng tồn không đủ!', 'danger');
    return;
  }

  showLoading(true);

  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.exporterPin;
  const payload = {
    action: 'export',
    itemId: itemId,
    qty: qty,
    recipient: recipient,
    purpose: purpose,
    note: note,
    date: new Date().toISOString(),
    pin: pinSecret,
    user: currentRole === 'admin' ? 'Admin' : 'Người xuất kho'
  };

  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Xuất kho thành công!', 'success');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    console.error(error);
    showToast('Gặp lỗi kết nối Supabase. Xử lý cục bộ.', 'warning');
    saveExportLocally(payload, item);
  }

  const isToSharedCabinet = document.getElementById('export-is-shared-cabinet') && document.getElementById('export-is-shared-cabinet').checked;
  const sharedLocation = (document.getElementById('export-shared-location') ? document.getElementById('export-shared-location').value.trim() : '') || 'Tủ dùng chung A';
  const sharedRemain = document.getElementById('export-shared-remain') ? document.getElementById('export-shared-remain').value.trim() : '';

  if (isToSharedCabinet && typeof addToSharedCabinet === 'function') {
    addToSharedCabinet({
      id_vat_tu: item.ID,
      ten: item.Ten,
      hang: item.Hang,
      quy_cach: item.Quy_Cach,
      don_vi: item.Don_Vi || 'Chai',
      vi_tri_tu: sharedLocation,
      so_luong: qty,
      khoi_luong_con_lai: sharedRemain || `${item.Quy_Cach || ''} (đã mở)`,
      nguoi_dua_vao: currentRole === 'admin' ? 'Admin' : 'Người xuất kho',
      ghi_chu: note ? `Xuất đưa vào tủ dùng chung: ${note}` : 'Đưa vào tủ dùng chung sau khi xuất kho'
    });
    showToast('Đã chuyển hóa chất vừa xuất vào Tủ Hóa Chất Dùng Chung!', 'success');
  }

  const scFields = document.getElementById('export-shared-cabinet-fields');
  if (scFields) scFields.style.display = 'none';

  document.getElementById('export-form').reset();
  showLoading(false);
}

function saveExportLocally(payload, item) {
  item.So_Luong -= payload.qty;

  const exportId = 'XK' + Date.now().toString().slice(-6);
  appData.exports.push({
    ID_Giao_Dich: exportId,
    ID_Vat_Tu: payload.itemId,
    Ten: item.Ten,
    Hang: item.Hang,
    Quy_Cach: item.Quy_Cach,
    So_Luong: payload.qty,
    Don_Vi: item.Don_Vi || 'cái',
    Ngay_Xuat: payload.date,
    Nguoi_Nhan: payload.recipient,
    Muc_Dich: payload.purpose,
    Nguoi_Xuat: payload.user,
    Ghi_Chu: payload.note
  });

  saveMockData();
  showToast('Lưu phiếu xuất kho cục bộ thành công!', 'success');
  document.getElementById('export-form').reset();
  
  populateDropdowns();
  renderInventory();
  renderHistory();
}

// --- ADMIN: SỬA THÔNG TIN VẬT TƯ & GHI NHẬT KÝ CHI TIẾT ---
window.openEditModal = function(itemId) {
  const item = appData.inventory.find(i => i.ID === itemId);
  if (!item) return;

  document.getElementById('edit-item-id').value = item.ID;
  document.getElementById('edit-code').value = item.Ma_So || '';
  document.getElementById('edit-name').value = item.Ten || '';
  document.getElementById('edit-brand').value = item.Hang || '';
  document.getElementById('edit-spec').value = item.Quy_Cach || '';
  document.getElementById('edit-location').value = item.Noi_Bao_Quan || '';
  document.getElementById('edit-qty').value = item.So_Luong || 0;
  document.getElementById('edit-unit').value = item.Don_Vi || 'Cái';
  document.getElementById('edit-expiry').value = item.Han_Su_Dung || '';
  document.getElementById('edit-year').value = item.Nam_Nhap || '';
  document.getElementById('edit-note').value = item.Ghi_Chu || '';

  // Phân quyền chi tiết động từ cài đặt Admin
  const isAdmin = currentRole === 'admin';
  const rolePermissions = isAdmin ? {
    code: true, name: true, brand: true, spec: true, location: true, qty: true, expiry: true, unit: true, year: true, note: true, delete: true
  } : (appConfig.permissions?.[currentRole] || {
    code: false, name: false, brand: false, spec: false, location: false, qty: false, expiry: false, unit: false, year: false, note: false, delete: false
  });
  
  const deleteBtn = document.getElementById('edit-delete-btn');
  if (deleteBtn) {
    deleteBtn.style.display = rolePermissions.delete ? 'inline-block' : 'none';
  }
  
  document.getElementById('edit-code').disabled = !rolePermissions.code;
  document.getElementById('edit-name').disabled = !rolePermissions.name;
  document.getElementById('edit-brand').disabled = !rolePermissions.brand;
  document.getElementById('edit-spec').disabled = !rolePermissions.spec;
  document.getElementById('edit-location').disabled = !rolePermissions.location;
  document.getElementById('edit-unit').disabled = !rolePermissions.unit;
  document.getElementById('edit-expiry').disabled = !rolePermissions.expiry;
  document.getElementById('edit-year').disabled = !rolePermissions.year;
  document.getElementById('edit-note').disabled = !rolePermissions.note;
  
  const editQtyInput = document.getElementById('edit-qty');
  const qtyBtns = document.querySelectorAll('#edit-item-form .quantity-control .qty-btn');
  
  if (editQtyInput) {
    editQtyInput.disabled = !rolePermissions.qty;
  }
  qtyBtns.forEach(btn => {
    btn.style.pointerEvents = rolePermissions.qty ? 'auto' : 'none';
    btn.style.opacity = rolePermissions.qty ? '1' : '0.5';
  });

  renderDynamicCustomFieldInputs(item);

  const submitBtn = document.querySelector('#edit-item-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.style.display = currentRole === 'student' ? 'none' : 'inline-block';
  }

  const modal = document.getElementById('edit-modal-overlay');
  if (modal) modal.classList.add('active');
};

window.closeEditModal = function() {
  const modal = document.getElementById('edit-modal-overlay');
  if (modal) modal.classList.remove('active');
};

async function handleEditSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('edit-item-id').value;
  const code = document.getElementById('edit-code').value.trim();
  const name = document.getElementById('edit-name').value.trim();
  const brand = document.getElementById('edit-brand').value.trim();
  const spec = document.getElementById('edit-spec').value.trim();
  const location = document.getElementById('edit-location').value.trim();
  const qty = parseFloat(document.getElementById('edit-qty').value);
  const unit = document.getElementById('edit-unit').value.trim();
  const expiry = document.getElementById('edit-expiry').value;
  const year = document.getElementById('edit-year').value.trim();
  const note = document.getElementById('edit-note').value.trim();

  if (!name || isNaN(qty) || qty < 0) {
    showToast('Dữ liệu nhập không hợp lệ!', 'danger');
    return;
  }

  showLoading(true);

  // Thu thập các giá trị custom fields động
  const customFieldsData = {};
  const customFields = appConfig.customFields || [];
  customFields.forEach(cf => {
    const input = document.getElementById(`edit-cf-${cf.key}`);
    if (input) {
      customFieldsData[cf.key] = input.value.trim();
    }
  });

  const oldItem = appData.inventory.find(i => i.ID === id);
  const oldSpecsText = oldItem ? getTechSpecsText(oldItem) : '';
  const techSpecsObj = {
    specText: oldSpecsText,
    customFields: customFieldsData
  };

  const payload = {
    action: 'edit_inventory',
    itemId: id,
    code: code,
    name: name,
    brand: brand,
    spec: spec,
    location: location,
    qty: qty,
    unit: unit,
    expiry: expiry,
    importYear: year,
    note: note,
    techSpecs: JSON.stringify(techSpecsObj),
    pin: currentRole === 'admin' ? appConfig.adminPin : (currentRole === 'importer' ? appConfig.importerPin : appConfig.exporterPin),
    user: currentRole === 'admin' ? 'Admin' : (currentRole === 'importer' ? 'Người nhập kho' : 'Người xuất kho')
  };

  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Cập nhật thông tin lên Supabase thành công!', 'success');
      closeEditModal();
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    console.error(error);
    showToast('Gặp lỗi kết nối Supabase. Cập nhật cục bộ.', 'warning');
    executeEditLocally(payload);
  }

  showLoading(false);
}

function executeEditLocally(payload) {
  const item = appData.inventory.find(i => i.ID === payload.itemId);
  if (item) {
    var oldCode = item.Ma_So || '';
    var oldName = item.Ten || '';
    var oldBrand = item.Hang || '';
    var oldSpec = item.Quy_Cach || '';
    var oldLoc = item.Noi_Bao_Quan || '';
    var oldQty = item.So_Luong || 0;
    var oldUnit = item.Don_Vi || 'Cái';
    var oldExp = item.Han_Su_Dung || '';
    var oldYear = item.Nam_Nhap || '';
    var oldNote = item.Ghi_Chu || '';

    item.Ma_So = payload.code;
    item.Ten = payload.name;
    item.Hang = payload.brand;
    item.Quy_Cach = payload.spec;
    item.Noi_Bao_Quan = payload.location;
    item.So_Luong = payload.qty;
    item.Don_Vi = payload.unit;
    item.Han_Su_Dung = payload.expiry;
    item.Nam_Nhap = payload.importYear;
    item.Ghi_Chu = payload.note;
    if (payload.techSpecs !== undefined) {
      item.Dac_Tinh_Ky_Thuat = payload.techSpecs;
    }

    var changes = [];
    if (oldCode !== payload.code) changes.push(`Mã số: [${oldCode}] -> [${payload.code}]`);
    if (oldName !== payload.name) changes.push(`Tên: [${oldName}] -> [${payload.name}]`);
    if (oldBrand !== payload.brand) changes.push(`Xuất xứ: [${oldBrand}] -> [${payload.brand}]`);
    if (oldSpec !== payload.spec) changes.push(`Quy cách: [${oldSpec}] -> [${payload.spec}]`);
    if (oldLoc !== payload.location) changes.push(`Vị trí: [${oldLoc}] -> [${payload.location}]`);
    if (oldQty !== payload.qty) changes.push(`Số lượng: [${oldQty}] -> [${payload.qty}]`);
    if (oldUnit !== payload.unit) changes.push(`ĐVT: [${oldUnit}] -> [${payload.unit}]`);
    if (oldExp !== payload.expiry) changes.push(`Hạn dùng: [${oldExp}] -> [${payload.expiry}]`);
    if (oldYear !== payload.importYear) changes.push(`Năm nhập: [${oldYear}] -> [${payload.importYear}]`);
    if (oldNote !== payload.note) changes.push(`Ghi chú: [${oldNote}] -> [${payload.note}]`);

    if (changes.length > 0) {
      const logId = 'EDIT' + Date.now().toString().slice(-6);
      appData.editLogs.push({
        ID_Log: logId,
        ID_Vat_Tu: item.ID,
        Ten_Vat_Tu: item.Ten,
        Chi_Tiet: changes.join("; "),
        Ngay_Chinh_Sua: new Date().toISOString(),
        Nguoi_Sua: payload.user || 'Admin'
      });
    }

    saveMockData();
    showToast('Đã chỉnh sửa thông tin cục bộ!', 'success');
    closeEditModal();
    renderInventory();
    populateDropdowns();
    renderEditLogs();
  }
}

// --- TẢI BIỂU MẪU EXCEL MẪU CHO NGƯỜI DÙNG ---
window.downloadSampleExcel = function() {
  if (currentRole === 'student') {
    alert('Sinh viên không có quyền tải biểu mẫu Excel!');
    return;
  }
  try {
    const headers = [["Mã số", "Danh mục vật tư", "Hãng", "Quy cách", "Nơi bảo quản", "Còn lại"]];
    const data = [
      ["TPVT-B1", "Bấc đèn cồn", "VN", "cái", "tủ D1", 2],
      ["TPVT-B2", "Bản sắc ký TLC Silica gel 60", "Merck", "Hộp", "Kho B", 12],
      ["TPVT-B3", "Bao hấp 30x50 cm", "VN", "kg", "Kho A", 5]
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(headers.concat(data));
    XLSX.utils.book_append_sheet(wb, ws, "Biểu mẫu Nhập Kho");
    XLSX.writeFile(wb, "Bieu_Mau_LabStock_Nhap_Excel.xlsx");
    showToast("Tải biểu mẫu Excel thành công!", "success");
  } catch (err) {
    console.error(err);
    showToast("Không thể tải biểu mẫu Excel: " + err.message, "danger");
  }
};

// --- ADMIN: XÓA VẬT TƯ KHỎI DANH MỤC ---
window.deleteChemicalFromEdit = async function() {
  const itemId = document.getElementById('edit-item-id').value;
  if (!itemId) return;
  
  const item = appData.inventory.find(i => i.ID === itemId);
  const itemName = item ? item.Ten : 'vật tư này';
  
  // Yêu cầu nhập lý do xóa bắt buộc
  const reason = prompt(`Nhập lý do xóa hoàn toàn hóa chất/vật tư "${itemName}" (Bắt buộc):`);
  if (reason === null) return; // Người dùng bấm Hủy
  
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    alert("Bạn phải nhập lý do xóa mới có thể tiến hành!");
    return;
  }
  
  const finalConfirm = confirm(`XÁC NHẬN LẦN CUỐI:\n\nBạn có chắc chắn muốn xóa hoàn toàn hóa chất/vật tư "${itemName}" ra khỏi danh mục tồn kho thực tế với lý do:\n"${trimmedReason}"?\n\n* Lưu ý: Hành động này không thể hoàn tác.`);
  if (!finalConfirm) return;
  
  showLoading(true);
  
  const userRoleLabel = currentRole === 'admin' ? 'Admin' : (currentRole === 'exporter' ? 'Người xuất kho' : (currentRole === 'importer' ? 'Người nhập kho' : 'Nhân viên'));
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : 
                    (currentRole === 'exporter' ? appConfig.exporterPin : 
                     (currentRole === 'importer' ? appConfig.importerPin : appConfig.staffPin));
  
  const payload = {
    action: 'delete_chemical',
    itemId: itemId,
    reason: trimmedReason,
    user: userRoleLabel,
    pin: pinSecret
  };
  
  if (appConfig.apiUrl || supabaseClient) {
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        showToast(`Đã xóa hoàn toàn "${itemName}" thành công!`, 'success');
        closeEditModal();
        await loadData();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối Supabase hoặc sai PIN. Thực hiện xóa cục bộ.', 'warning');
      executeDeleteChemicalLocally(itemId, itemName, trimmedReason, userRoleLabel);
    }
  } else {
    executeDeleteChemicalLocally(itemId, itemName, trimmedReason, userRoleLabel);
  }
  
  showLoading(false);
};

function executeDeleteChemicalLocally(itemId, itemName, reason, userLabel) {
  const idx = appData.inventory.findIndex(i => i.ID === itemId);
  if (idx !== -1) {
    appData.inventory.splice(idx, 1);
    
    // Ghi nhận nhật ký để theo dõi
    const logId = 'DEL' + Date.now().toString().slice(-6);
    appData.editLogs.push({
      ID_Log: logId,
      ID_Vat_Tu: itemId,
      Ten_Vat_Tu: itemName,
      Chi_Tiet: `Đã xóa hoàn toàn hóa chất/vật tư. Lý do: ${reason || 'Không có lý do'}`,
      Ngay_Chinh_Sua: new Date().toISOString(),
      Nguoi_Sua: userLabel || 'Admin'
    });
    
    saveMockData();
    showToast(`Đã xóa hoàn toàn "${itemName}" khỏi danh mục tồn kho thực tế!`, 'success');
    closeEditModal();
    renderInventory();
    populateDropdowns();
    renderEditLogs();
  }
}

// --- ADMIN: SAO LƯU VÀ XÓA SẠCH TOÀN BỘ KHO ---
function exportInventoryBackupExcel() {
  if (!appData) return;
  const now = new Date();
  
  const inventoryRows = appData.inventory.map(item => ({
    'Mã Số': item.Ma_So,
    'Tên Vật Tư': item.Ten,
    'Hãng': item.Hang,
    'Quy Cách': item.Quy_Cach,
    'Nơi Bảo Quản': item.Noi_Bao_Quan,
    'Số Lượng Tồn': item.So_Luong,
    'Đơn Vị': item.Don_Vi,
    'Hạn Sử Dụng': item.Han_Su_Dung,
    'Năm Nhập': item.Nam_Nhap,
    'Ghi Chú': item.Ghi_Chu
  }));

  const importRows = appData.imports.map(i => ({
    'Mã GD': i.ID_Giao_Dich,
    'ID Vật Tư': i.ID_Vat_Tu,
    'Tên': i.Ten,
    'Hãng': i.Hang,
    'Quy Cách': i.Quy_Cach,
    'SL Nhập': i.So_Luong,
    'Đơn Vị': i.Don_Vi,
    'Ngày Nhập': i.Ngay_Nhap ? new Date(i.Ngay_Nhap).toLocaleString('vi-VN') : '',
    'Người Nhập': i.Nguoi_Nhap,
    'Ghi Chú': i.Ghi_Chu || ''
  }));

  const exportRows = appData.exports.map(e => ({
    'Mã GD': e.ID_Giao_Dich,
    'ID Vật Tư': e.ID_Vat_Tu,
    'Tên': e.Ten,
    'SL Xuất': e.So_Luong,
    'Đơn Vị': e.Don_Vi,
    'Người Nhận': e.Nguoi_Nhan,
    'Mục Đích': e.Muc_Dich,
    'Ngày Xuất': e.Ngay_Xuat ? new Date(e.Ngay_Xuat).toLocaleString('vi-VN') : '',
    'Người Xuất': e.Nguoi_Xuat,
    'Ghi Chú': e.Ghi_Chu || ''
  }));

  const requestRows = (appData.requests || []).map(r => ({
    'Mã Yêu Cầu': r.ID_Yeu_Cau,
    'ID Vật Tư': r.ID_Vat_Tu,
    'Tên': r.Ten,
    'Hãng/Quy Cách': `${r.Hang || ''} | ${r.Quy_Cach || ''}`,
    'SL Yêu Cầu': r.So_Luong_Yeu_Cau,
    'Đơn Vị': r.Don_Vi,
    'Người Yêu Cầu': r.Nguoi_Yeu_Cau,
    'Mục Đích': r.Muc_Dich,
    'Ngày Yêu Cầu': r.Ngay_Yeu_Cau ? new Date(r.Ngay_Yeu_Cau).toLocaleString('vi-VN') : '',
    'Trạng Thái': r.Trang_Thai,
    'Ghi Chú': r.Ghi_Chu || ''
  }));

  const editRows = (appData.editLogs || []).map(log => ({
    'Mã Nhật Ký': log.ID_Log,
    'ID Vật Tư': log.ID_Vat_Tu,
    'Tên Vật Tư': log.Ten_Vat_Tu,
    'Thay Đổi': log.Noi_Dung_Thay_Doi,
    'Thời Gian': log.Ngay_Chinh_Sua ? new Date(log.Ngay_Chinh_Sua).toLocaleString('vi-VN') : '',
    'Người Thực Hiện': log.Nguoi_Chinh_Sua
  }));

  try {
    const wb = XLSX.utils.book_new();
    
    const wsInv = XLSX.utils.json_to_sheet(inventoryRows);
    XLSX.utils.book_append_sheet(wb, wsInv, 'Tồn Kho Thực Tế');
    
    if (importRows.length > 0) {
      const wsImp = XLSX.utils.json_to_sheet(importRows);
      XLSX.utils.book_append_sheet(wb, wsImp, 'Lịch sử Nhập');
    }
    if (exportRows.length > 0) {
      const wsExp = XLSX.utils.json_to_sheet(exportRows);
      XLSX.utils.book_append_sheet(wb, wsExp, 'Lịch sử Xuất');
    }
    if (requestRows.length > 0) {
      const wsReq = XLSX.utils.json_to_sheet(requestRows);
      XLSX.utils.book_append_sheet(wb, wsReq, 'Yêu Cầu Xuất');
    }
    if (editRows.length > 0) {
      const wsEdits = XLSX.utils.json_to_sheet(editRows);
      XLSX.utils.book_append_sheet(wb, wsEdits, 'Nhật Ký Sửa Đổi');
    }

    XLSX.writeFile(wb, `Sao_Luu_Kho_LabStock_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}.xlsx`);
    showToast('Tải dữ liệu sao lưu Excel thành công!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Lỗi sao lưu Excel: ' + err.message, 'danger');
  }
}

window.clearAllInventoryWithBackup = async function() {
  if (currentRole !== 'admin') {
    showToast('Chỉ có vai trò Admin mới có quyền thực hiện hành động này!', 'danger');
    return;
  }
  
  const confirmBackup = confirm("Hệ thống sẽ tiến hành tải xuống một file Excel sao lưu toàn bộ dữ liệu trước khi xóa trắng. Bạn có chắc chắn muốn tiếp tục?");
  if (!confirmBackup) return;
  
  // Tải file backup trước
  exportInventoryBackupExcel();
  
  // Trì hoãn 1 chút để việc download bắt đầu
  await new Promise(r => setTimeout(r, 1000));
  
  // Hỏi mã pin
  const pinInput = prompt("Để xác nhận xóa trắng TOÀN BỘ KHO, vui lòng nhập mã PIN Admin:");
  if (pinInput !== appConfig.adminPin) {
    showToast("Mã PIN Admin không chính xác. Hủy bỏ hành động xóa kho!", "danger");
    return;
  }
  
  const finalConfirm = confirm("CẢNH BÁO: Hành động này không thể hoàn tác! Bạn có thực sự muốn xóa sạch toàn bộ kho để bắt đầu lại?");
  if (!finalConfirm) return;
  
  showLoading(true);
  
  const payload = {
    action: 'clear_all_inventory',
    pin: appConfig.adminPin
  };
  
  if (appConfig.apiUrl) {
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        showToast('Đã xóa sạch toàn bộ kho trên Supabase thành công!', 'success');
        await loadData();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối Supabase. Tiến hành xóa dữ liệu cục bộ.', 'warning');
      executeClearAllLocally();
    }
  } else {
    executeClearAllLocally();
  }
  
  showLoading(false);
};

function executeClearAllLocally() {
  appData.inventory = [];
  appData.imports = [];
  appData.exports = [];
  appData.requests = [];
  appData.editLogs = [];
  saveMockData();
  showToast('Đã xóa trắng toàn bộ dữ liệu kho cục bộ thành công!', 'success');
  loadData();
  switchTab('inventory');
}

// === SAO LƯU & PHỤC HỒI DỮ LIỆU TOÀN BỘ KHO QUA EXCEL (CHỈ ADMIN) ===
window.downloadFullBackupExcel = async function() {
  if (currentRole !== 'admin') {
    alert('Chỉ quản trị viên mới có quyền tải dữ liệu sao lưu!');
    return;
  }
  showLoading(true);
  initSupabase();
  if (!supabaseClient) {
    alert('Không có kết nối Supabase!');
    showLoading(false);
    return;
  }
  
  try {
    const [inv, imp, exp, req, spec, logs, cfg] = await Promise.all([
      supabaseClient.from('kho_vat_tu').select('*'),
      supabaseClient.from('lich_su_nhap').select('*'),
      supabaseClient.from('lich_su_xuat').select('*'),
      supabaseClient.from('yeu_cau_xuat').select('*'),
      supabaseClient.from('yeu_cau_dac_tinh').select('*').then(res => res.error ? { data: [] } : res),
      supabaseClient.from('nhat_ky_sua').select('*'),
      supabaseClient.from('cau_hinh').select('*')
    ]);
    
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();
    
    // Thêm các sheet
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inv.data || []), "kho_vat_tu");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(imp.data || []), "lich_su_nhap");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exp.data || []), "lich_su_xuat");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(req.data || []), "yeu_cau_xuat");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(spec.data || []), "yeu_cau_dac_tinh");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(logs.data || []), "nhat_ky_sua");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cfg.data || []), "cau_hinh");
    
    // Xuất file
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `lab_inventory_backup_${dateStr}.xlsx`);
  } catch (err) {
    console.error(err);
    alert('Lỗi sao lưu dữ liệu: ' + err.message);
  }
  showLoading(false);
};

window.restoreFullBackupExcel = async function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!confirm('⚠️ CẢNH BÁO CỰC KỲ QUAN TRỌNG:\n\nHành động này sẽ XÓA TOÀN BỘ dữ liệu hiện tại trên hệ thống và ghi đè bằng dữ liệu từ file Excel này.\n\nHệ thống sẽ tự động tải xuống một bản sao lưu dữ liệu hiện tại trước khi khôi phục.\n\nBạn có chắc chắn muốn khôi phục không?')) {
    event.target.value = '';
    return;
  }
  
  showLoading(true);
  initSupabase();
  if (!supabaseClient) {
    alert('Không có kết nối Supabase!');
    showLoading(false);
    event.target.value = '';
    return;
  }
  
  try {
    // 1. Tự động sao lưu dự phòng trước khi khôi phục
    await downloadFullBackupExcel();
    
    // 2. Đọc file excel tải lên
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        
        const tables = ['kho_vat_tu', 'lich_su_nhap', 'lich_su_xuat', 'yeu_cau_xuat', 'yeu_cau_dac_tinh', 'nhat_ky_sua', 'cau_hinh'];
        
        // 3. Khôi phục từng bảng
        for (const tableName of tables) {
          if (!sheetNames.includes(tableName)) continue;
          
          const sheet = workbook.Sheets[tableName];
          const rows = XLSX.utils.sheet_to_json(sheet);
          
          // Định nghĩa trường để xóa
          let filterCol = 'id';
          if (tableName === 'cau_hinh') filterCol = 'key';
          if (tableName === 'lich_su_nhap' || tableName === 'lich_su_xuat') filterCol = 'id_giao_dich';
          if (tableName === 'yeu_cau_xuat') filterCol = 'id_yeu_cau';
          if (tableName === 'yeu_cau_dac_tinh') filterCol = 'id_de_xuat';
          if (tableName === 'nhat_ky_sua') filterCol = 'id_log';
          
          // Xóa toàn bộ dòng
          const { error: delErr } = await supabaseClient.from(tableName).delete().neq(filterCol, 'X_X_X_NO_MATCH_X_X_X');
          if (delErr) {
            console.warn(`Lỗi khi xóa bảng ${tableName}:`, delErr);
          }
          
          // Chèn các dòng mới
          if (rows.length > 0) {
            const { error: insErr } = await supabaseClient.from(tableName).insert(rows);
            if (insErr) {
              throw new Error(`Lỗi chèn dữ liệu vào bảng ${tableName}: ${insErr.message}`);
            }
          }
        }
        
        alert('Khôi phục dữ liệu từ file Excel thành công!');
        await loadData();
      } catch (err) {
        console.error(err);
        alert('Lỗi phân tích hoặc nạp dữ liệu: ' + err.message);
      } finally {
        showLoading(false);
        event.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    console.error(err);
    alert('Lỗi chuẩn bị khôi phục dữ liệu: ' + err.message);
    showLoading(false);
    event.target.value = '';
  }
};

// --- IMPORT EXCEL BẰNG SHEETJS ---
async function handleExcelImport(e) {
  if (currentRole === 'student') {
    alert('Sinh viên không có quyền nhập dữ liệu từ Excel!');
    return;
  }
  const file = e.target.files[0];
  if (!file) return;

  showLoading(true);
  const reader = new FileReader();
  
  reader.onload = async function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      if (rows.length < 3) {
        showToast('File Excel trống hoặc không đúng mẫu!', 'danger');
        showLoading(false);
        return;
      }

      let headerRowIndex = -1;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row && row.some(cell => typeof cell === 'string' && 
            (cell.toLowerCase().includes('danh mục') || cell.toLowerCase().includes('mã số') || cell.toLowerCase().includes('quy cách')))) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        showToast('Không tìm thấy dòng tiêu đề trong file Excel!', 'danger');
        showLoading(false);
        return;
      }

      const headers = rows[headerRowIndex];
      let colCode = -1, colName = -1, colBrand = -1, colSpec = -1, colLocation = -1, colQty = -1;
      
      headers.forEach((h, idx) => {
        if (!h) return;
        const text = removeVietnameseTones(h.toString());
        if (text.includes('ma so')) colCode = idx;
        else if (text.includes('danh muc vat tu') || text.includes('ten')) colName = idx;
        else if (text.includes('xuat xu') || text.includes('hang')) colBrand = idx;
        else if (text.includes('quy cach')) colSpec = idx;
        else if (text.includes('noi bao quan')) colLocation = idx;
        else if (text.includes('con lai') || text.includes('thuc te')) colQty = idx;
      });

      if (colName === -1) colName = 2;
      if (colCode === -1) colCode = 1;
      if (colBrand === -1) colBrand = 3;
      if (colSpec === -1) colSpec = 4;
      if (colLocation === -1) colLocation = 5;
      if (colQty === -1) colQty = 11;

      const items = [];
      for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[colName]) continue;

        const codeVal = row[colCode] ? row[colCode].toString().trim() : '';
        const nameVal = row[colName].toString().trim();
        const brandVal = row[colBrand] ? row[colBrand].toString().trim() : '';
        const specVal = row[colSpec] ? row[colSpec].toString().trim() : '';
        const locationVal = row[colLocation] ? row[colLocation].toString().trim() : '';
        
        let qtyVal = parseFloat(row[colQty]);
        if (isNaN(qtyVal)) qtyVal = 0;

        let unitVal = 'Cái';
        if (specVal.toLowerCase().includes('chai')) unitVal = 'Chai';
        else if (specVal.toLowerCase().includes('lo')) unitVal = 'Lọ';
        else if (specVal.toLowerCase().includes('hop')) unitVal = 'Hộp';
        else if (specVal.toLowerCase().includes('kg')) unitVal = 'Kg';
        else if (specVal.toLowerCase().includes('cuon')) unitVal = 'Cuộn';
        else if (specVal.toLowerCase().includes('doi')) unitVal = 'Đôi';

        items.push({
          code: codeVal,
          name: nameVal,
          brand: brandVal,
          spec: specVal,
          location: locationVal,
          qty: qtyVal,
          unit: unitVal,
          expiry: '',
          importYear: '',
          note: ''
        });
      }

      if (items.length === 0) {
        showToast('Không đọc được dữ liệu vật tư nào!', 'danger');
        showLoading(false);
        return;
      }

      items.forEach(excelItem => {
        importCart.push({
          id: 'IMP' + Date.now() + Math.floor(Math.random() * 1000) + Math.random().toString().slice(-4),
          code: excelItem.code,
          name: excelItem.name,
          brand: excelItem.brand || '',
          spec: excelItem.spec || '',
          location: excelItem.location,
          qty: excelItem.qty,
          unit: excelItem.unit,
          expiry: excelItem.expiry || '',
          importYear: excelItem.importYear || new Date().getFullYear().toString(),
          note: excelItem.note || ''
        });
      });
      
      localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
      showToast(`Đã nạp ${items.length} vật tư từ Excel vào rổ hàng chờ nhập.`, 'success');
      showLoading(false);
      switchTab('import');

    } catch (err) {
      console.error(err);
      showToast('Lỗi xử lý file Excel: ' + err.message, 'danger');
    }
    showLoading(false);
    document.getElementById('excel-file-input').value = '';
  };
  reader.readAsArrayBuffer(file);
}

// --- POPUP CÀI ĐẶT ---
let currentEditingCategory = '';

window.openSettingsModal = function(category) {
  currentEditingCategory = category;
  if (!appConfig[currentEditingCategory]) {
    appConfig[currentEditingCategory] = [];
  }
  const titleMap = {
    'brands': 'Cài đặt Hãng sản xuất mặc định',
    'specs': 'Cài đặt Quy cách mặc định',
    'recipients': 'Cài đặt Người nhận mặc định',
    'purposes': 'Cài đặt Mục đích xuất mặc định',
    'units': 'Cài đặt Đơn vị tính',
    'locations': 'Cài đặt Danh mục Vị trí bảo quản',
    'sharedLocations': 'Cài đặt Danh mục Vị trí Tủ dùng chung'
  };

  const modalTitle = document.getElementById('settings-modal-title');
  if (modalTitle) modalTitle.innerText = titleMap[category] || 'Cài đặt';

  renderSettingsList();
  
  const modal = document.getElementById('settings-modal-overlay');
  if (modal) modal.classList.add('active');
};

window.closeSettingsModal = async function() {
  const modal = document.getElementById('settings-modal-overlay');
  if (modal) modal.classList.remove('active');
  populateDropdowns();
  
  // Tự động lưu cấu hình tùy chọn mới lên Supabase để không bị mất
  initSupabase();
  if (supabaseClient) {
    try {
      await sendRequest({
        action: 'save_config',
        config: appConfig
      });
      console.log('Đã tự động đồng bộ cấu hình mới lên Supabase.');
    } catch (err) {
      console.error('Lỗi đồng bộ cấu hình lên Supabase:', err);
    }
  }
};

function renderSettingsList() {
  const container = document.getElementById('settings-items-container');
  if (!container) return;

  container.innerHTML = '';
  const list = appConfig[currentEditingCategory] || [];

  if (list.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1rem;">Chưa có phần tử nào.</div>`;
    return;
  }

  list.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'settings-list-item';
    div.innerHTML = `
      <span>${item}</span>
      <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="deleteSettingItem(${index})">Xóa</button>
    `;
    container.appendChild(div);
  });
}

window.addSettingItem = function() {
  const input = document.getElementById('new-setting-item-val');
  if (!input) return;

  const val = input.value.trim();
  if (!val) {
    showToast('Không được để trống!', 'danger');
    return;
  }

  if (appConfig[currentEditingCategory].includes(val)) {
    showToast('Giá trị đã tồn tại!', 'danger');
    return;
  }

  appConfig[currentEditingCategory].push(val);
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  input.value = '';
  renderSettingsList();
  showToast('Đã thêm thành công!', 'success');
};

window.deleteSettingItem = function(index) {
  appConfig[currentEditingCategory].splice(index, 1);
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  renderSettingsList();
  showToast('Đã xóa thành công!', 'success');
};

function renderSettings() {
  const urlEl = document.getElementById('supabase-url-input');
  const keyEl = document.getElementById('supabase-key-input');
  if (urlEl) urlEl.value = appConfig.supabaseUrl || '';
  if (keyEl) keyEl.value = appConfig.supabaseKey || '';
  document.getElementById('admin-pin-input').value = appConfig.adminPin || '1234';
  document.getElementById('importer-pin-input').value = appConfig.importerPin || '2222';
  document.getElementById('exporter-pin-input').value = appConfig.exporterPin || '3333';
  document.getElementById('staff-pin-input').value = appConfig.staffPin || '';
  if (document.getElementById('student-pin-input')) {
    document.getElementById('student-pin-input').value = appConfig.studentPin || '0';
  }
  
  document.getElementById('config-show-export').checked = !!appConfig.showAdminExportTab;
  document.getElementById('config-show-import').checked = !!appConfig.showAdminImportTab;
  document.getElementById('config-show-cart').checked = !!appConfig.showAdminCartTab;
  
  // Điền dữ liệu cho ma trận phân quyền
  const perms = appConfig.permissions || {
    staff: {}, student: {}, importer: {}, exporter: {}
  };
  
  const fields = ['code', 'name', 'brand', 'spec', 'unit', 'location', 'qty', 'expiry', 'year', 'note', 'delete'];
  fields.forEach(f => {
    const staffEl = document.getElementById(`p-staff-${f}`);
    const studentEl = document.getElementById(`p-student-${f}`);
    const impEl = document.getElementById(`p-importer-${f}`);
    const expEl = document.getElementById(`p-exporter-${f}`);
    
    if (staffEl) staffEl.checked = !!perms.staff?.[f];
    if (studentEl) studentEl.checked = !!perms.student?.[f];
    if (impEl) {
      if (f === 'delete') {
        impEl.checked = !!perms.importer?.[f];
      } else {
        impEl.checked = perms.importer?.[f] !== false;
      }
    }
    if (expEl) {
      if (f === 'delete') {
        expEl.checked = !!perms.exporter?.[f];
      } else {
        expEl.checked = perms.exporter?.[f] !== false;
      }
    }
  });
  
  document.getElementById('config-app-title').value = appConfig.APP_TITLE || "Kho VTHC Phòng CNSH Thực phẩm";
  document.getElementById('config-app-version').value = appConfig.APP_VERSION || SYSTEM_APP_VERSION;
  if (document.getElementById('config-lab-org')) document.getElementById('config-lab-org').value = appConfig.labOrgName || "HỆ THỐNG QUẢN LÝ PHÒNG THÍ NGHIỆM";
  if (document.getElementById('config-lab-room')) document.getElementById('config-lab-room').value = appConfig.labRoomName || "Phòng Thí Nghiệm CNSH Thực Phẩm";
  if (document.getElementById('config-exporter-name')) document.getElementById('config-exporter-name').value = appConfig.exporterName || "Người xuất kho";
  document.getElementById('config-tab-inventory').value = appConfig.TAB_NAME_INVENTORY || "Tồn Kho";
  document.getElementById('config-tab-export').value = appConfig.TAB_NAME_EXPORT || "Duyệt & Xuất";
  document.getElementById('config-tab-import').value = appConfig.TAB_NAME_IMPORT || "Nhập Kho";
  document.getElementById('config-tab-history').value = appConfig.TAB_NAME_HISTORY || "Lịch Sử";
  document.getElementById('config-tab-dashboard').value = appConfig.TAB_NAME_DASHBOARD || "Biểu Đồ";
  renderCustomFieldsSettings();
}

function showToast(message, type = 'primary') {
  // Cho phép hiển thị tất cả các loại thông báo bao gồm cả success và primary
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'danger') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span>${icon}</span>
      <span>${message}</span>
    </div>
    <span style="cursor: pointer; font-weight: bold; margin-left: 1rem;" onclick="this.parentElement.remove()">×</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- SWITCH HISTORY VIEW ---
window.switchHistoryView = function(viewType) {
  const toggleTimelineBtn = document.getElementById('toggle-timeline-btn');
  const toggleTablesBtn = document.getElementById('toggle-tables-btn');
  const timelineContainer = document.getElementById('history-timeline-container');
  const tablesContainer = document.getElementById('history-tables-container');
  
  if (viewType === 'timeline') {
    if (toggleTimelineBtn) {
      toggleTimelineBtn.classList.add('active');
      toggleTimelineBtn.style.background = 'var(--primary)';
      toggleTimelineBtn.style.color = 'white';
    }
    if (toggleTablesBtn) {
      toggleTablesBtn.classList.remove('active');
      toggleTablesBtn.style.background = 'transparent';
      toggleTablesBtn.style.color = 'var(--text-muted)';
    }
    if (timelineContainer) timelineContainer.style.display = 'block';
    if (tablesContainer) tablesContainer.style.display = 'none';
    renderTimeline();
  } else {
    if (toggleTimelineBtn) {
      toggleTimelineBtn.classList.remove('active');
      toggleTimelineBtn.style.background = 'transparent';
      toggleTimelineBtn.style.color = 'var(--text-muted)';
    }
    if (toggleTablesBtn) {
      toggleTablesBtn.classList.add('active');
      toggleTablesBtn.style.background = 'var(--primary)';
      toggleTablesBtn.style.color = 'white';
    }
    if (timelineContainer) timelineContainer.style.display = 'none';
    if (tablesContainer) tablesContainer.style.display = 'block';
  }
};

// --- RENDER DÒNG THỜI GIAN HOẠT ĐỘNG CHUNG (TIMELINE VIEW) ---
function renderTimeline() {
  const container = document.getElementById('history-timeline-container');
  if (!container || !appData) return;
  
  container.innerHTML = '';
  
  // 1. Gom tất cả hoạt động
  const timelineEvents = [];
  
  // Nhập kho
  (appData.imports || []).forEach(item => {
    timelineEvents.push({
      id: item.ID_Giao_Dich,
      itemId: item.ID_Vat_Tu,
      type: 'import',
      dateStr: item.Ngay_Nhap,
      date: new Date(item.Ngay_Nhap || Date.now()),
      user: item.Nguoi_Nhap || 'Nhân viên',
      itemName: item.Ten,
      brand: item.Hang || '',
      spec: item.Quy_Cach || '',
      qty: item.So_Luong,
      unit: item.Don_Vi || 'cái',
      note: item.Ghi_Chu
    });
  });
  
  // Xuất kho
  (appData.exports || []).forEach(item => {
    timelineEvents.push({
      id: item.ID_Giao_Dich,
      itemId: item.ID_Vat_Tu,
      type: 'export',
      dateStr: item.Ngay_Xuat,
      date: new Date(item.Ngay_Xuat || Date.now()),
      user: item.Nguoi_Xuat || 'Nhân viên',
      recipient: item.Nguoi_Nhan || 'Người nhận',
      itemName: item.Ten,
      brand: item.Hang || '',
      spec: item.Quy_Cach || '',
      qty: item.So_Luong,
      unit: item.Don_Vi || 'cái',
      purpose: item.Muc_Dich,
      note: item.Ghi_Chu
    });
  });
  
  // Chỉnh sửa của Admin
  (appData.editLogs || []).forEach(item => {
    let detailText = '';
    try {
      let parsed = item.Chi_Tiet;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && typeof parsed === 'object') {
        detailText = parsed.formatted || '';
      } else {
        detailText = item.Chi_Tiet || '';
      }
    } catch(e) {
      detailText = item.Chi_Tiet || '';
    }

    timelineEvents.push({
      id: item.ID_Log,
      itemId: item.ID_Vat_Tu,
      type: 'edit',
      dateStr: item.Ngay_Chinh_Sua,
      date: new Date(item.Ngay_Chinh_Sua || Date.now()),
      user: item.Nguoi_Sua || 'Admin',
      itemName: item.Ten_Vat_Tu,
      details: detailText
    });
  });
  
  // 2. Lọc thời gian theo bộ lọc
  const filter = document.getElementById('report-time-filter') ? document.getElementById('report-time-filter').value : 'all';
  const now = new Date();
  
  const filteredEvents = timelineEvents.filter(ev => {
    if (!ev.dateStr) return false;
    if (filter === 'all') return true;
    
    const diffTime = Math.abs(now - ev.date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (filter === 'week') return diffDays <= 7;
    if (filter === 'month') return diffDays <= 30;
    if (filter === 'year') return ev.date.getFullYear() === now.getFullYear();
    
    return true;
  });
  
  // 3. Sắp xếp mới nhất lên đầu
  filteredEvents.sort((a, b) => b.date - a.date);
  
  if (filteredEvents.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Chưa ghi nhận hoạt động nào trong khoảng thời gian này.</div>`;
    return;
  }
  
  // 4. Render từng thẻ timeline
  filteredEvents.forEach(ev => {
    const card = document.createElement('div');
    card.className = `timeline-card timeline-card-${ev.type}`;
    
    let badge = '⏳';
    let headerText = '';
    let bodyText = '';
    let footerExtra = '';
    
    const timeFormatted = ev.date.toLocaleString('vi-VN');
    
    if (ev.type === 'import') {
      badge = '📥';
      headerText = `<span class="timeline-action"><span class="badge-import-icon" style="width: 24px; height: 24px; font-size: 0.95rem; border-radius: 6px; margin-right: 0.25rem;">📥</span> Nhập kho vật tư mới</span>`;
      bodyText = `Người dùng <strong>${ev.user}</strong> đã nhập kho thêm <span class="badge badge-success">+${ev.qty} ${ev.unit}</span> vật tư <span class="timeline-item-link" onclick="openItemHistoryModal('${ev.itemId}')"><strong>${ev.itemName}</strong></span> (${ev.brand || 'K/P'} | ${ev.spec || 'K/P'}).`;
      footerExtra = ev.note ? `<span class="timeline-note">Ghi chú: ${ev.note}</span>` : '';
    } else if (ev.type === 'export') {
      badge = '📤';
      headerText = `<span class="timeline-action"><span class="badge-export-icon" style="width: 24px; height: 24px; font-size: 0.95rem; border-radius: 6px; margin-right: 0.25rem;">📤</span> Xuất kho cấp phát</span>`;
      bodyText = `Người xuất <strong>${ev.user}</strong> đã cấp phát <span class="badge badge-danger">-${ev.qty} ${ev.unit}</span> vật tư <span class="timeline-item-link" onclick="openItemHistoryModal('${ev.itemId}')"><strong>${ev.itemName}</strong></span> cho người nhận <strong>${ev.recipient}</strong> sử dụng cho mục đích: <em>${ev.purpose || 'K/P'}</em>.`;
      footerExtra = ev.note ? `<span class="timeline-note">Ghi chú: ${ev.note}</span>` : '';
    } else if (ev.type === 'edit') {
      badge = '🛠️';
      headerText = `<span class="timeline-action">🛠️ Admin sửa thông tin</span>`;
      bodyText = `Quản trị viên <strong>${ev.user}</strong> đã cập nhật thông tin vật tư <span class="timeline-item-link" onclick="openItemHistoryModal('${ev.itemId}')"><strong>${ev.itemName}</strong></span>. Chi tiết: <span style="font-family: monospace; color: var(--warning);">${ev.details}</span>`;
      footerExtra = '';
    }
    
    const footerHtml = footerExtra ? `
      <div class="timeline-footer">
        ${footerExtra}
      </div>
    ` : '';

    card.innerHTML = `
      <div class="timeline-badge">${badge}</div>
      <div class="timeline-content">
        <div class="timeline-header">
          ${headerText}
          <span class="timeline-time">${timeFormatted}</span>
        </div>
        <div class="timeline-body">
          ${bodyText}
        </div>
        ${footerHtml}
      </div>
    `;
    container.appendChild(card);
  });
}

// === NOTIFICATION BADGES LOGIC ===
window.updateNotificationDots = function() {
  const isExporterOrAdmin = currentRole === 'admin' || currentRole === 'exporter';
  const isImporterOrAdmin = currentRole === 'admin' || currentRole === 'importer';
  
  const hasPendingExport = appData && appData.requests && appData.requests.some(r => r.Trang_Thai === 'Cho_Duyet');
  const hasPendingSpec = appData && appData.specRequests && appData.specRequests.some(r => r.Trang_Thai === 'Cho_Duyet');
  
  const showExportDot = isExporterOrAdmin && hasPendingExport;
  const showSpecDot = isImporterOrAdmin && hasPendingSpec;
  
  const exportDot = document.getElementById('nav-export-dot');
  const mobExportDot = document.getElementById('mobile-nav-export-dot');
  
  const activeDot = showExportDot || showSpecDot;
  if (exportDot) exportDot.style.display = activeDot ? 'inline-block' : 'none';
  if (mobExportDot) mobExportDot.style.display = activeDot ? 'inline-block' : 'none';
  
  const isStaff = currentRole === 'staff' || currentRole === 'admin';
  const rejectedRequests = (appData && appData.requests) ? appData.requests.filter(r => r.Trang_Thai === 'Tu_Choi') : [];
  const showNotiDot = isStaff && rejectedRequests.length > 0;
  
  const notiCount = document.getElementById('nav-noti-count');
  const mobNotiDot = document.getElementById('mobile-nav-noti-dot');
  
  if (notiCount) {
    if (showNotiDot) {
      notiCount.style.display = 'inline-block';
      notiCount.textContent = rejectedRequests.length;
    } else {
      notiCount.style.display = 'none';
    }
  }
  if (mobNotiDot) mobNotiDot.style.display = showNotiDot ? 'inline-block' : 'none';
};

// === RỔ HÀNG NHẬP KHO (IMPORT CART) LOGIC ===
window.renderImportCart = function() {
  const container = document.getElementById('import-cart-card');
  const tbody = document.getElementById('import-cart-tbody');
  const badge = document.getElementById('import-cart-badge');
  const selectAllCb = document.getElementById('import-select-all');
  
  if (!tbody || !container) return;
  
  if (importCart.length === 0) {
    container.style.display = 'none';
    if (badge) badge.textContent = '0';
    return;
  }
  
  container.style.display = 'block';
  if (badge) badge.textContent = importCart.length;
  tbody.innerHTML = '';
  
  importCart.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center; vertical-align: middle;">
        <input type="checkbox" class="import-item-checkbox" data-index="${index}" style="width: 16px; height: 16px; cursor: pointer;" onchange="updateImportBatchActionsVisibility()">
      </td>
      <td>
        <input type="text" class="table-input" style="font-family: monospace; font-size: 0.8rem; width: 80px;" value="${item.code || ''}" onchange="updateImportCartField(${index}, 'code', this.value)">
      </td>
      <td>
        <input type="text" class="table-input" style="font-weight: 600; min-width: 140px;" value="${item.name || ''}" onchange="updateImportCartField(${index}, 'name', this.value)">
      </td>
      <td>
        <input type="text" class="table-input" style="min-width: 100px;" value="${(item.brand === 'K/P') ? '' : (item.brand || '')}" list="list-brands" onchange="updateImportCartField(${index}, 'brand', this.value)">
      </td>
      <td>
        <input type="text" class="table-input" style="min-width: 100px;" value="${(item.spec === 'K/P') ? '' : (item.spec || '')}" list="list-specs" onchange="updateImportCartField(${index}, 'spec', this.value)">
      </td>
      <td>
        <div class="qty-control-sm">
          <button type="button" class="qty-btn-sm" onclick="adjustImportQty(${index}, -1)">-</button>
          <input type="number" class="qty-input-sm" id="import-qty-${index}" value="${item.qty}" min="0.1" step="0.1" onchange="changeImportQty(${index}, this.value)">
          <button type="button" class="qty-btn-sm" onclick="adjustImportQty(${index}, 1)">+</button>
        </div>
      </td>
      <td>
        <input type="text" class="table-input" style="width: 60px;" value="${item.unit || ''}" list="list-units" onchange="updateImportCartField(${index}, 'unit', this.value)">
      </td>
      <td>
        <input type="text" class="table-input" style="width: 100px;" value="${item.location || ''}" list="list-locations" onchange="updateImportCartField(${index}, 'location', this.value)">
      </td>
      <td>
        <input type="date" class="table-input" style="width: 125px; padding: 2px;" value="${item.expiry || ''}" onchange="updateImportCartField(${index}, 'expiry', this.value)">
      </td>
      <td>
        <input type="number" class="table-input" style="width: 70px;" value="${item.importYear || ''}" onchange="updateImportCartField(${index}, 'importYear', this.value)">
      </td>
      <td>
        <input type="text" class="table-input" style="min-width: 120px;" value="${item.note || ''}" onchange="updateImportCartField(${index}, 'note', this.value)">
      </td>
      <td style="text-align: right; vertical-align: middle;">
        <button class="btn btn-danger btn-sm" style="padding: 0.35rem 0.65rem;" onclick="removeFromImportCart(${index})">Xóa 🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (selectAllCb) {
    selectAllCb.checked = false;
    selectAllCb.onclick = () => {
      const isChecked = selectAllCb.checked;
      document.querySelectorAll('.import-item-checkbox').forEach(cb => {
        cb.checked = isChecked;
      });
      updateImportBatchActionsVisibility();
    };
  }
};

window.updateImportCartField = function(index, field, value) {
  if (!importCart[index]) return;
  importCart[index][field] = value;
  localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
};

window.updateImportBatchActionsVisibility = function() {
  const checkboxes = document.querySelectorAll('.import-item-checkbox');
  const batchActions = document.getElementById('import-batch-actions');
  const checked = Array.from(checkboxes).some(cb => cb.checked);
  if (batchActions) {
    batchActions.style.display = checked ? 'flex' : 'none';
  }
};

window.adjustImportQty = function(index, change) {
  if (!importCart[index]) return;
  let newVal = importCart[index].qty + change;
  if (newVal > 0) {
    importCart[index].qty = Math.round(newVal * 10) / 10;
    renderImportCart();
  }
};

window.changeImportQty = function(index, value) {
  if (!importCart[index]) return;
  let val = parseFloat(value) || 1;
  importCart[index].qty = Math.max(val, 0.1);
  renderImportCart();
};

window.removeFromImportCart = function(index) {
  importCart.splice(index, 1);
  localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
  renderImportCart();
  updateImportBatchActionsVisibility();
  showToast('Đã xóa vật tư khỏi rổ hàng nhập.', 'primary');
};

window.clearImportCart = function() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ rổ hàng nhập kho tạm thời?')) {
    importCart = [];
    localStorage.removeItem('LAB_IMPORT_CART_V5');
    renderImportCart();
    updateImportBatchActionsVisibility();
    showToast('Đã xóa toàn bộ rổ hàng nhập kho.', 'primary');
  }
};

window.deleteSelectedImportItems = function() {
  const checkboxes = document.querySelectorAll('.import-item-checkbox:checked');
  if (checkboxes.length === 0) return;
  
  if (confirm(`Bạn có chắc chắn muốn xóa ${checkboxes.length} dòng đã chọn khỏi rổ hàng?`)) {
    const indices = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-index'))).sort((a, b) => b - a);
    indices.forEach(idx => {
      importCart.splice(idx, 1);
    });
    localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
    renderImportCart();
    updateImportBatchActionsVisibility();
    showToast('Đã xóa các mục đã chọn thành công!', 'success');
  }
};

window.submitSelectedImportItems = async function() {
  const checkboxes = document.querySelectorAll('.import-item-checkbox:checked');
  if (checkboxes.length === 0) return;
  
  const indices = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-index')));
  const selectedItems = indices.map(idx => importCart[idx]);
  
  if (!confirm(`Bạn có chắc chắn muốn duyệt nhập kho ${selectedItems.length} dòng đã chọn?`)) {
    return;
  }
  
  showLoading(true);
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.importerPin;
  const payload = {
    action: 'bulk_import',
    items: selectedItems,
    pin: pinSecret
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast(`Đã duyệt nhập kho thành công ${selectedItems.length} vật tư!`, 'success');
      indices.sort((a, b) => b - a).forEach(idx => {
        importCart.splice(idx, 1);
      });
      localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
      renderImportCart();
      updateImportBatchActionsVisibility();
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch (err) {
    console.error(err);
    showToast('Lỗi kết nối. Duyệt lưu cục bộ các mục đã chọn.', 'warning');
    selectedItems.forEach(excelItem => {
      let item = appData.inventory.find(i => 
        i.Ten.toLowerCase() === excelItem.name.toLowerCase() &&
        i.Hang.toLowerCase() === excelItem.brand.toLowerCase() &&
        i.Quy_Cach.toLowerCase() === excelItem.spec.toLowerCase()
      );
      
      let targetId = '';
      if (item) {
        item.So_Luong += excelItem.qty;
        item.Ma_So = excelItem.code;
        item.Noi_Bao_Quan = excelItem.location;
        item.Don_Vi = excelItem.unit;
        targetId = item.ID;
      } else {
        const newId = 'VT' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
        appData.inventory.push({
          ID: newId,
          Ma_So: excelItem.code,
          Ten: excelItem.name,
          Hang: excelItem.brand,
          Quy_Cach: excelItem.spec,
          Noi_Bao_Quan: excelItem.location,
          So_Luong: excelItem.qty,
          Don_Vi: excelItem.unit,
          Han_Su_Dung: excelItem.expiry,
          Nam_Nhap: excelItem.importYear,
          Ghi_Chu: excelItem.note
        });
        targetId = newId;
      }
      
      const importId = 'NK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const userRoleStr = currentRole === 'admin' ? 'Admin' : 'Người nhập kho';
      appData.imports.push({
        ID_Giao_Dich: importId,
        ID_Vat_Tu: targetId,
        Ten: excelItem.name,
        Hang: excelItem.brand,
        Quy_Cach: excelItem.spec,
        So_Luong: excelItem.qty,
        Don_Vi: excelItem.unit,
        Ngay_Nhap: new Date().toISOString(),
        Nguoi_Nhap: userRoleStr,
        Ghi_Chu: excelItem.note
      });
    });
    saveMockData();
    indices.sort((a, b) => b - a).forEach(idx => {
      importCart.splice(idx, 1);
    });
    localStorage.setItem('LAB_IMPORT_CART_V5', JSON.stringify(importCart));
    renderImportCart();
    updateImportBatchActionsVisibility();
    renderInventory();
    populateDropdowns();
  }
  showLoading(false);
};

window.submitImportCart = async function() {
  if (importCart.length === 0) return;
  
  if (!confirm(`Bạn có chắc chắn muốn duyệt và lưu thực tế ${importCart.length} dòng hàng này vào tồn kho?`)) {
    return;
  }
  
  showLoading(true);
  
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.importerPin;
  const payload = {
    action: 'bulk_import',
    items: importCart,
    pin: pinSecret
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast(`Đã duyệt nhập kho thành công ${importCart.length} vật tư lên Supabase!`, 'success');
      importCart = [];
      localStorage.removeItem('LAB_IMPORT_CART_V5');
      renderImportCart();
      updateImportBatchActionsVisibility();
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error(err);
    showToast('Có lỗi kết nối. Thực hiện duyệt lưu cục bộ.', 'warning');
    importCart.forEach(excelItem => {
      let item = appData.inventory.find(i => 
        i.Ten.toLowerCase() === excelItem.name.toLowerCase() &&
        i.Hang.toLowerCase() === excelItem.brand.toLowerCase() &&
        i.Quy_Cach.toLowerCase() === excelItem.spec.toLowerCase()
      );

      let targetId = '';
      if (item) {
        item.So_Luong += excelItem.qty;
        item.Ma_So = excelItem.code;
        item.Noi_Bao_Quan = excelItem.location;
        item.Don_Vi = excelItem.unit;
        targetId = item.ID;
      } else {
        const newId = 'VT' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
        appData.inventory.push({
          ID: newId,
          Ma_So: excelItem.code,
          Ten: excelItem.name,
          Hang: excelItem.brand,
          Quy_Cach: excelItem.spec,
          Noi_Bao_Quan: excelItem.location,
          So_Luong: excelItem.qty,
          Don_Vi: excelItem.unit,
          Han_Su_Dung: excelItem.expiry,
          Nam_Nhap: excelItem.importYear,
          Ghi_Chu: excelItem.note
        });
        targetId = newId;
      }
      
      const importId = 'NK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
      const userRoleStr = currentRole === 'admin' ? 'Admin' : 'Người nhập kho';
      appData.imports.push({
        ID_Giao_Dich: importId,
        ID_Vat_Tu: targetId,
        Ten: excelItem.name,
        Hang: excelItem.brand,
        Quy_Cach: excelItem.spec,
        So_Luong: excelItem.qty,
        Don_Vi: excelItem.unit,
        Ngay_Nhap: new Date().toISOString(),
        Nguoi_Nhap: userRoleStr,
        Ghi_Chu: excelItem.note
      });
    });
    saveMockData();
    importCart = [];
    localStorage.removeItem('LAB_IMPORT_CART_V5');
    renderImportCart();
    updateImportBatchActionsVisibility();
    renderInventory();
    populateDropdowns();
  }
  
  showLoading(false);
};

// === DUYỆT HÀNG LOẠT VÀ GOM NHÓM PHIẾU YÊU CẦU XUẤT KHO ===
window.updateBatchActionsVisibility = function() {
  const checkboxes = document.querySelectorAll('.group-select-checkbox');
  const batchActions = document.getElementById('batch-approve-actions');
  const checked = Array.from(checkboxes).some(cb => cb.checked);
  if (batchActions) {
    batchActions.style.display = checked ? 'flex' : 'none';
  }
};

window.approveGroup = async function(itemIdsStr) {
  const ids = itemIdsStr.split(',');
  showLoading(true);
  
  // Đọc mục đích xuất kho đã thay đổi từ dòng đầu tiên trong nhóm
  const firstId = ids[0];
  const purposeInput = document.getElementById(`group-purpose-${firstId}`);
  const updatedPurpose = purposeInput ? purposeInput.value.trim() : '';
  
  let successCount = 0;
  for (const id of ids) {
    const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
    const qtyInput = document.getElementById(`approve-qty-${id}`);
    let qty = qtyInput ? parseFloat(qtyInput.value) : NaN;
    if (isNaN(qty) || qty <= 0) {
      qty = req ? parseFloat(req.So_Luong_Yeu_Cau) || 1 : 1;
    }
    
    // Kiểm tra số lượng tồn kho thực tế trước khi duyệt
    const item = appData.inventory.find(i => i.ID === (req ? req.ID_Vat_Tu : ''));
    const currentStock = item ? (parseFloat(item.So_Luong) || 0) : 0;
    if (qty > currentStock) {
      showToast(`Không đủ tồn kho để duyệt cho "${req ? req.Ten : 'vật tư'}"! (Yêu cầu duyệt: ${qty}, Hiện có: ${currentStock})`, 'danger');
      showLoading(false);
      return;
    }
    
    const pinSecret = currentRole === 'admin' ? appConfig.adminPin : (currentRole === 'importer' ? appConfig.importerPin : appConfig.exporterPin);
    const payload = {
      action: 'approve_export',
      requestId: id,
      qty: qty,
      purpose: updatedPurpose,
      note: req && req.replacementItemId ? 'Duyệt thay thế hóa chất' : 'Duyệt theo nhóm đề xuất',
      pin: pinSecret
    };
    if (req && req.replacementItemId) {
      payload.replacementItemId = req.replacementItemId;
    }
    
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        successCount++;
      }
    } catch(e) {
      console.error(e);
      const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
      const item = appData.inventory.find(i => i.ID === (req ? req.ID_Vat_Tu : ''));
      if (req && item) {
        executeApproveLocally(id, qty, 'Duyệt theo nhóm đề xuất', item, updatedPurpose);
        successCount++;
      }
    }
  }
  
  showLoading(false);
  await loadData();
  showToast(`Đã duyệt thành công ${successCount}/${ids.length} yêu cầu!`, 'success');
};

window.rejectGroup = async function(itemIdsStr) {
  const ids = itemIdsStr.split(',');
  const reason = prompt('Nhập lý do từ chối chung cho đợt yêu cầu này:') || 'Không được phê duyệt';
  
  showLoading(true);
  let successCount = 0;
  for (const id of ids) {
    const pinSecret = currentRole === 'admin' ? appConfig.adminPin : (currentRole === 'importer' ? appConfig.importerPin : appConfig.exporterPin);
    const payload = {
      action: 'reject_export',
      requestId: id,
      note: reason,
      pin: pinSecret
    };
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        successCount++;
      }
    } catch(e) {
      console.error(e);
      const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
      if (req) {
        req.Trang_Thai = 'Tu_Choi';
        req.Ghi_Chu = reason;
        successCount++;
      }
    }
  }
  
  if (currentRole !== 'admin') saveMockData();
  showLoading(false);
  showToast(`Đã từ chối thành công ${successCount}/${ids.length} yêu cầu!`, 'primary');
  await loadData();
};

window.rejectSingleRequest = async function(id) {
  const reason = prompt('Nhập lý do từ chối yêu cầu này:') || 'Không được phê duyệt';
  showLoading(true);
  
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : (currentRole === 'importer' ? appConfig.importerPin : appConfig.exporterPin);
  const payload = {
    action: 'reject_export',
    requestId: id,
    note: reason,
    pin: pinSecret
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Đã từ chối yêu cầu thành công!', 'success');
    }
  } catch(e) {
    console.error(e);
    const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
    if (req) {
      req.Trang_Thai = 'Tu_Choi';
      req.Ghi_Chu = reason;
      saveMockData();
      showToast('Từ chối thành công cục bộ!', 'success');
    }
  }
  
  showLoading(false);
  await loadData();
};

window.batchApproveRequests = async function() {
  const checkboxes = document.querySelectorAll('.group-select-checkbox:checked');
  if (checkboxes.length === 0) return;
  
  let allIds = [];
  checkboxes.forEach(cb => {
    const ids = cb.getAttribute('data-ids').split(',');
    allIds = allIds.concat(ids);
  });
  
  if (confirm(`Bạn có chắc chắn muốn duyệt đồng loạt ${allIds.length} yêu cầu đã chọn?`)) {
    showLoading(true);
    let successCount = 0;
    for (const id of allIds) {
      const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
      const qtyInput = document.getElementById(`approve-qty-${id}`);
      let qty = qtyInput ? parseFloat(qtyInput.value) : NaN;
      if (isNaN(qty) || qty <= 0) {
        qty = req ? parseFloat(req.So_Luong_Yeu_Cau) || 1 : 1;
      }
      
      // Kiểm tra số lượng tồn kho thực tế trước khi duyệt hàng loạt
      const item = appData.inventory.find(i => i.ID === (req ? req.ID_Vat_Tu : ''));
      const currentStock = item ? (parseFloat(item.So_Luong) || 0) : 0;
      if (qty > currentStock) {
        showToast(`Không đủ tồn kho để duyệt hàng loạt cho "${req ? req.Ten : 'vật tư'}"! (Yêu cầu duyệt: ${qty}, Hiện có: ${currentStock})`, 'danger');
        showLoading(false);
        return;
      }

      const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.exporterPin;
      const payload = {
        action: 'approve_export',
        requestId: id,
        qty: qty,
        note: req && req.replacementItemId ? 'Duyệt thay thế hàng loạt' : 'Duyệt hàng loạt',
        pin: pinSecret
      };
      if (req && req.replacementItemId) {
        payload.replacementItemId = req.replacementItemId;
      }
      
      try {
        const json = await sendRequest(payload);
        if (json.success) successCount++;
      } catch(e) {
        const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
        const item = appData.inventory.find(i => i.ID === (req ? req.ID_Vat_Tu : ''));
        if (req && item) {
          executeApproveLocally(id, qty, 'Duyệt hàng loạt', item);
          successCount++;
        }
      }
    }
    showLoading(false);
    showToast(`Đã duyệt đồng loạt thành công ${successCount}/${allIds.length} yêu cầu!`, 'success');
    await loadData();
  }
};

window.batchRejectRequests = async function() {
  const checkboxes = document.querySelectorAll('.group-select-checkbox:checked');
  if (checkboxes.length === 0) return;
  
  let allIds = [];
  checkboxes.forEach(cb => {
    const ids = cb.getAttribute('data-ids').split(',');
    allIds = allIds.concat(ids);
  });
  
  const reason = prompt('Nhập lý do từ chối chung cho các yêu cầu đã chọn:') || 'Không được duyệt hàng loạt';
  
  if (confirm(`Bạn có chắc chắn muốn từ chối hàng loạt ${allIds.length} yêu cầu đã chọn?`)) {
    showLoading(true);
    let successCount = 0;
    for (const id of allIds) {
      const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.exporterPin;
      const payload = {
        action: 'reject_export',
        requestId: id,
        note: reason,
        pin: pinSecret
      };
      try {
        const json = await sendRequest(payload);
        if (json.success) successCount++;
      } catch(e) {
        const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
        if (req) {
          req.Trang_Thai = 'Tu_Choi';
          req.Ghi_Chu = reason;
          successCount++;
        }
      }
    }
    if (currentRole !== 'admin') saveMockData();
    showLoading(false);
    showToast(`Đã từ chối hàng loạt thành công ${successCount}/${allIds.length} yêu cầu!`, 'primary');
    await loadData();
  }
};

// === 2-TAB MODAL LOGIC & ĐẶC TÍNH KỸ THUẬT ===
window.switchModalTab = function(tabName) {
  document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
  
  const activeBtn = document.getElementById(`modal-tab-${tabName}-btn`);
  const activeContent = document.getElementById(`modal-tab-${tabName}`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
};

window.saveTechSpecsDetail = async function() {
  if (!currentViewingItemId || !appData) return;
  const item = appData.inventory.find(i => i.ID === currentViewingItemId);
  if (!item) return;
  
  const newVal = document.getElementById('item-detail-tech-specs').value.trim();
  
  let techSpecsJson = '';
  try {
    let parsed = item.Dac_Tinh_Ky_Thuat || '{}';
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    if (parsed && typeof parsed === 'object') {
      parsed.specText = newVal;
      techSpecsJson = JSON.stringify(parsed);
    } else {
      techSpecsJson = JSON.stringify({ specText: newVal, customFields: {} });
    }
  } catch (e) {
    techSpecsJson = JSON.stringify({ specText: newVal, customFields: {} });
  }

  showLoading(true);
  
  if (currentRole === 'staff') {
    const payload = {
      action: 'propose_spec_feature',
      itemId: currentViewingItemId,
      name: item.Ten,
      techSpecs: techSpecsJson,
      user: 'Nhân viên'
    };
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        showToast('Đã gửi đề xuất đặc tính kỹ thuật thành công!', 'success');
        closeItemHistoryModal();
        await loadData();
      } else {
        throw new Error(json.message);
      }
    } catch(err) {
      console.error(err);
      showToast('Không thể gửi đề xuất: ' + err.message, 'danger');
    }
  } else {
    const pinSecret = currentRole === 'admin' ? appConfig.adminPin : 
                      currentRole === 'exporter' ? appConfig.exporterPin : appConfig.importerPin;
    const payload = {
      action: 'edit_inventory',
      itemId: currentViewingItemId,
      code: item.Ma_So,
      name: item.Ten,
      brand: item.Hang,
      spec: item.Quy_Cach,
      location: item.Noi_Bao_Quan,
      qty: item.So_Luong,
      unit: item.Don_Vi,
      expiry: item.Han_Su_Dung,
      importYear: item.Nam_Nhap,
      note: item.Ghi_Chu,
      techSpecs: techSpecsJson,
      pin: pinSecret,
      user: currentRole === 'admin' ? 'Admin' : currentRole === 'exporter' ? 'Người xuất kho' : 'Người nhập kho'
    };
    
    try {
      const json = await sendRequest(payload);
      if (json.success) {
        showToast('Cập nhật đặc tính kỹ thuật trực tiếp thành công!', 'success');
        closeItemHistoryModal();
        await loadData();
      } else {
        throw new Error(json.message);
      }
    } catch(err) {
      console.error(err);
      // Cục bộ
      item.Dac_Tinh_Ky_Thuat = techSpecsJson;
      saveMockData();
      showToast('Đã cập nhật đặc tính kỹ thuật cục bộ!', 'success');
      closeItemHistoryModal();
      renderInventory();
    }
  }
  showLoading(false);
};

// === DUYỆT ĐỀ XUẤT ĐẶC TÍNH KỸ THUẬT PHÍA ADMIN/IMPORTER ===
window.renderSpecRequests = function() {
  const card = document.getElementById('spec-approval-card');
  const tbody = document.getElementById('spec-requests-table-body');
  if (!card || !tbody || !appData) return;
  
  const pendingSpecs = (appData.specRequests || []).filter(r => r.Trang_Thai === 'Cho_Duyet');
  const isImporterOrAdmin = currentRole === 'admin' || currentRole === 'importer';
  
  if (pendingSpecs.length === 0 || !isImporterOrAdmin) {
    card.style.display = 'none';
    return;
  }
  
  card.style.display = 'block';
  tbody.innerHTML = '';
  
  pendingSpecs.forEach(req => {
    const timeFormatted = req.Ngay_De_Xuat ? new Date(req.Ngay_De_Xuat).toLocaleString('vi-VN') : '-';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${req.Ten_Vat_Tu}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(ID: ${req.ID_Vat_Tu})</span></td>
      <td><span class="badge badge-primary">${req.Nguoi_De_Xuat}</span></td>
      <td><span style="font-size:0.8rem;">⏱️ ${timeFormatted}</span></td>
      <td>
        <div style="background:var(--bg-app); border:1px solid var(--border); border-radius:6px; padding:0.5rem; font-size:0.85rem; max-width:400px; white-space:pre-wrap;">${req.Dac_Tinh_De_Xuat}</div>
      </td>
      <td style="text-align: right;">
        <button class="btn btn-success btn-sm" onclick="approveSpecRequest('${req.ID_De_Xuat}')">✅ Duyệt</button>
        <button class="btn btn-danger btn-sm" onclick="rejectSpecRequest('${req.ID_De_Xuat}')">❌ Từ chối</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.approveSpecRequest = async function(deXuatId) {
  showLoading(true);
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.importerPin;
  const payload = {
    action: 'approve_spec_feature',
    requestId: deXuatId,
    pin: pinSecret
  };
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Đã duyệt đặc tính kỹ thuật mới!', 'success');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error(err);
    // Cục bộ
    const req = appData.specRequests.find(r => r.ID_De_Xuat === deXuatId);
    if (req) {
      req.Trang_Thai = 'Da_Duyet';
      const item = appData.inventory.find(i => i.ID === req.ID_Vat_Tu);
      if (item) item.Dac_Tinh_Ky_Thuat = req.Dac_Tinh_De_Xuat;
      saveMockData();
      showToast('Duyệt đề xuất cục bộ thành công!', 'success');
      await loadData();
    }
  }
  showLoading(false);
};

window.rejectSpecRequest = async function(deXuatId) {
  const reason = prompt('Nhập lý do từ chối đề xuất này:') || 'Không duyệt sửa đổi';
  showLoading(true);
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.importerPin;
  const payload = {
    action: 'reject_spec_feature',
    requestId: deXuatId,
    note: reason,
    pin: pinSecret
  };
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Đã từ chối đề xuất đặc tính kỹ thuật.', 'primary');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error(err);
    const req = appData.specRequests.find(r => r.ID_De_Xuat === deXuatId);
    if (req) {
      req.Trang_Thai = 'Tu_Choi';
      req.Ly_Do_Tu_Choi = reason;
      saveMockData();
      showToast('Từ chối đề xuất cục bộ!', 'success');
      await loadData();
    }
  }
  showLoading(false);
};

// === THÔNG BÁO TỪ CHỐI CẤP PHÁT PHÍA NHÂN VIÊN ===
window.renderNotifications = function() {
  const tbody = document.getElementById('notifications-table-body');
  const historyTbody = document.getElementById('notifications-history-table-body');
  if (!appData) return;
  
  const isStaff = currentRole === 'staff' || currentRole === 'admin';
  if (!isStaff) return;
  
  // 1. Render active rejections
  const rejectedRequests = (appData.requests || []).filter(r => r.Trang_Thai === 'Tu_Choi');
  
  if (tbody) {
    if (rejectedRequests.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Không có thông báo từ chối mới nào.</td></tr>`;
    } else {
      tbody.innerHTML = '';
      rejectedRequests.forEach(req => {
        const timeFormatted = req.Ngay_Yeu_Cau ? new Date(req.Ngay_Yeu_Cau).toLocaleString('vi-VN') : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span style="font-family: monospace; font-size:0.75rem;">#${req.ID_Yeu_Cau.slice(0, 8)}</span><br><span style="font-size:0.7rem; color:var(--text-muted);">${timeFormatted}</span></td>
          <td><span class="noti-badge" style="margin-right:8px; width:16px; height:16px; line-height:16px; font-size:11px; display:inline-block; animation:none;"></span><strong>${req.Ten}</strong></td>
          <td>${req.Quy_Cach || 'K/P'} | ${req.Hang || 'K/P'}</td>
          <td><span class="badge badge-danger">${req.So_Luong_Yeu_Cau}</span></td>
          <td>${req.Don_Vi || 'Cái'}</td>
          <td><span style="font-size: 0.8rem;">${req.Muc_Dich || '-'}</span></td>
          <td><span style="color: var(--danger); font-size: 0.85rem; font-weight: 600;">❌ ${req.Ghi_Chu || 'Người duyệt từ chối'}</span></td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" onclick="clearNotification('${req.ID_Yeu_Cau}')">Đã đọc ✓</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // 2. Render past read rejections history
  const readRejectedRequests = (appData.requests || []).filter(r => r.Trang_Thai === 'Da_Doc_Tu_Choi');
  if (historyTbody) {
    if (readRejectedRequests.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Không có lịch sử yêu cầu bị từ chối trước đây.</td></tr>`;
    } else {
      historyTbody.innerHTML = '';
      readRejectedRequests.forEach(req => {
        const timeFormatted = req.Ngay_Yeu_Cau ? new Date(req.Ngay_Yeu_Cau).toLocaleString('vi-VN') : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span style="font-family: monospace; font-size:0.75rem;">#${req.ID_Yeu_Cau.slice(0, 8)}</span><br><span style="font-size:0.7rem; color:var(--text-muted);">${timeFormatted}</span></td>
          <td><strong>${req.Ten}</strong></td>
          <td>${req.Quy_Cach || 'K/P'} | ${req.Hang || 'K/P'}</td>
          <td><span class="badge badge-secondary">${req.So_Luong_Yeu_Cau}</span></td>
          <td>${req.Don_Vi || 'Cái'}</td>
          <td><span style="font-size: 0.8rem;">${req.Muc_Dich || '-'}</span></td>
          <td><span style="color: var(--text-muted); font-size: 0.85rem;">${req.Ghi_Chu || 'Không phê duyệt'}</span></td>
        `;
        historyTbody.appendChild(tr);
      });
    }
  }
};

window.clearNotification = async function(reqId) {
  showLoading(true);
  
  // Cập nhật giao diện cục bộ ngay lập tức để ẩn thông báo ngay
  const req = appData.requests.find(r => r.ID_Yeu_Cau === reqId);
  if (req) {
    req.Trang_Thai = 'Da_Doc_Tu_Choi';
    saveMockData();
    renderNotifications();
    updateNotificationDots();
  }

  const pinSecret = appConfig.staffPin || '';
  const payload = {
    action: 'clear_notification',
    requestId: reqId,
    pin: pinSecret
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error("Lỗi đồng bộ xóa thông báo lên Supabase:", err);
  }
  showLoading(false);
};

// === HOÀN TÁC GIAO DỊCH XUẤT KHO DƯỚI 1 GIỜ ===
window.undoExport = async function(transactionId) {
  const txIds = transactionId.split(',');
  const confirmMsg = txIds.length > 1
    ? `Bạn có chắc chắn muốn hoàn tác (Undo) nhóm giao dịch xuất kho này (${txIds.length} mặt hàng)? \nSố lượng sẽ được cộng hoàn trả lại tồn kho.`
    : 'Bạn có chắc chắn muốn hoàn tác (Undo) giao dịch xuất kho này? \nSố lượng hóa chất đã xuất sẽ được cộng hoàn trả lại tồn kho.';
    
  if (!confirm(confirmMsg)) {
    return;
  }
  
  showLoading(true);
  const pinSecret = currentRole === 'admin' ? appConfig.adminPin : appConfig.exporterPin;
  const payload = {
    action: 'undo_export',
    transactionIds: transactionId,
    pin: pinSecret
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast('Đã hoàn tác giao dịch xuất kho thành công!', 'success');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error(err);
    txIds.forEach(txId => {
      const transaction = appData.exports.find(x => x.ID_Giao_Dich === txId);
      if (transaction) {
        const item = appData.inventory.find(i => i.ID === transaction.ID_Vat_Tu);
        if (item) {
          item.So_Luong += transaction.So_Luong;
        }
        appData.exports = appData.exports.filter(x => x.ID_Giao_Dich !== txId);
        const logId = "UNDO" + Date.now();
        appData.editLogs.push({
          ID_Log: logId,
          ID_Vat_Tu: transaction.ID_Vat_Tu,
          Ten_Vat_Tu: transaction.Ten,
          Noi_Dung_Thay_Doi: `Hoàn tác giao dịch xuất ${txId}. Hoàn lại +${transaction.So_Luong} ${transaction.Don_Vi}`,
          Ngay_Chinh_Sua: new Date().toISOString(),
          Nguoi_Chinh_Sua: currentRole === 'admin' ? 'Admin' : 'Người xuất kho'
        });
      }
    });
    
    saveMockData();
    showToast('Supabase chưa cấu hình. Đã thực hiện hoàn tác cục bộ thành công!', 'warning');
    renderHistory();
    renderInventory();
    renderEditLogs();
  }
  showLoading(false);
};

window.cleanUpOldHistory = async function() {
  const rangeSelect = document.getElementById('clean-history-range');
  const months = rangeSelect.value;
  
  let confirmMsg = '';
  if (months === 'all_processed') {
    confirmMsg = `Bạn có chắc chắn muốn XÓA SẠCH toàn bộ các yêu cầu xuất kho đã duyệt, bị từ chối và đã hủy trên hệ thống không?`;
  } else {
    confirmMsg = `Bạn có chắc chắn muốn dọn dẹp và xóa vĩnh viễn các dữ liệu lịch sử (Nhập/Xuất/Nhật ký) cũ hơn ${months} tháng trên hệ thống không?`;
  }
  
  if (!confirm(confirmMsg)) {
    return;
  }
  
  showLoading(true);
  const payload = {
    action: 'clean_history',
    months: months,
    pin: appConfig.adminPin
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      if (months === 'all_processed') {
        showToast(`Đã xóa sạch tất cả yêu cầu xuất kho đã duyệt/từ chối/hủy thành công!`, 'success');
      } else {
        showToast(`Dọn dẹp lịch sử cũ hơn ${months} tháng thành công!`, 'success');
      }
      await loadData();
      renderCancelledRequests();
      renderMyRequests();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error(err);
    if (months === 'all_processed') {
      appData.requests = (appData.requests || []).filter(item => item.Trang_Thai === 'Cho_Duyet');
      saveMockData();
      showToast(`Supabase chưa cấu hình. Đã dọn dẹp sạch lịch sử các yêu cầu đã xử lý cục bộ!`, 'warning');
    } else {
      const monthsNum = parseInt(months) || 3;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsNum);
      const cutoffTime = cutoffDate.getTime();
      
      appData.imports = (appData.imports || []).filter(item => {
        const t = item.Ngay_Nhap ? new Date(item.Ngay_Nhap).getTime() : 0;
        return t >= cutoffTime;
      });
      
      appData.exports = (appData.exports || []).filter(item => {
        const t = item.Ngay_Xuat ? new Date(item.Ngay_Xuat).getTime() : 0;
        return t >= cutoffTime;
      });
      
      appData.editLogs = (appData.editLogs || []).filter(item => {
        const t = item.Ngay_Chinh_Sua ? new Date(item.Ngay_Chinh_Sua).getTime() : 0;
        return t >= cutoffTime;
      });
      
      appData.requests = (appData.requests || []).filter(item => {
        if (item.Trang_Thai === 'Cho_Duyet') return true;
        const t = item.Ngay_Yeu_Cau ? new Date(item.Ngay_Yeu_Cau).getTime() : 0;
        return t >= cutoffTime;
      });
      
      saveMockData();
      showToast(`Supabase chưa cấu hình. Đã dọn dẹp lịch sử cũ hơn ${monthsNum} tháng cục bộ!`, 'warning');
    }
    renderHistory();
    renderEditLogs();
    renderCancelledRequests();
    renderMyRequests();
  }
  showLoading(false);
};

window.applyAppConfigUI = function() {
  if (!appConfig) return;
  
  const titleEl = document.getElementById('navbar-app-title');
  if (titleEl) {
    const subSpan = titleEl.querySelector('.brand-sub');
    titleEl.childNodes[0].nodeValue = appConfig.APP_TITLE || "Kho VTHC Phòng CNSH Thực phẩm";
    if (subSpan) {
      // Tự động gán phiên bản chuẩn v1.1 theo đúng tiến trình hoàn thiện, không bắt buộc chờ admin sửa
      subSpan.textContent = "Quản lý hóa chất & vật tư thí nghiệm - " + SYSTEM_APP_VERSION;
    }
  }

  const badgeBtn = document.getElementById('changelog-badge-btn');
  if (badgeBtn) {
    badgeBtn.innerHTML = `✨ Bản mới (${SYSTEM_APP_VERSION})`;
  }
  
  const updateLabel = (desktopId, mobileId, value) => {
    const el = document.querySelector(`#${desktopId} .nav-text`);
    const mobEl = document.querySelector(`#${mobileId} .mobile-nav-label`);
    if (el && value) el.textContent = value;
    if (mobEl && value) mobEl.textContent = value;
  };
  
  updateLabel('nav-inventory', 'mobile-nav-inventory', appConfig.TAB_NAME_INVENTORY);
  updateLabel('nav-export', 'mobile-nav-export', appConfig.TAB_NAME_EXPORT);
  updateLabel('nav-import', 'mobile-nav-import', appConfig.TAB_NAME_IMPORT);
  updateLabel('nav-history', 'mobile-nav-history', appConfig.TAB_NAME_HISTORY);
  updateLabel('nav-dashboard', 'mobile-nav-dashboard', appConfig.TAB_NAME_DASHBOARD);
};

window.renderDashboardCharts = function() {
  const rootEl = document.getElementById('react-dashboard-root');
  if (!rootEl) return;

  const { useState, createElement: el } = React;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } = Recharts;

  // Helper: Format date key YYYY-MM-DD
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const exportsList = (appData && appData.exports) || [];

  // Hàm lọc danh sách xuất theo khoảng thời gian thực tế
  const getFilteredExports = (timeRange) => {
    const now = new Date();
    const cutoff = new Date();
    if (timeRange === '30') {
      cutoff.setDate(now.getDate() - 30);
    } else if (timeRange === '90') {
      cutoff.setDate(now.getDate() - 90);
    } else {
      cutoff.setDate(now.getDate() - 365);
    }
    
    return exportsList.filter(x => {
      if (!x.Ngay_Xuat) return false;
      const d = new Date(x.Ngay_Xuat);
      return d >= cutoff && d <= now;
    });
  };

  // 1. CHUẨN BỊ DATA CHO HEATMAP (Dựa hoàn toàn trên dữ liệu thực)
  const getHeatmapData = (timeRange, filteredList) => {
    const now = new Date();
    
    if (timeRange === '30') {
      const days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        days.push(d);
      }
      return days.map(date => {
        const dateStr = formatDateKey(date);
        let qty = 0;
        filteredList.forEach(x => {
          if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(dateStr)) {
            qty += parseFloat(x.So_Luong) || 0;
          }
        });
        return { label: `Ngày ${date.getDate()}`, subLabel: dateStr.slice(5), qty };
      });
    } else if (timeRange === '90') {
      const weeks = [];
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - (i * 7 + 6));
        const end = new Date(now);
        end.setDate(now.getDate() - (i * 7));
        weeks.push({ start, end, label: `Tuần ${12 - i}` });
      }
      return weeks.map(w => {
        let qty = 0;
        filteredList.forEach(x => {
          if (x.Ngay_Xuat) {
            const xDate = new Date(x.Ngay_Xuat);
            if (xDate >= w.start && xDate <= w.end) {
              qty += parseFloat(x.So_Luong) || 0;
            }
          }
        });
        const dateRangeStr = `${w.start.getDate()}/${w.start.getMonth()+1}-${w.end.getDate()}/${w.end.getMonth()+1}`;
        return { label: w.label, subLabel: dateRangeStr, qty };
      });
    } else {
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(m);
      }
      return months.map(m => {
        const year = m.getFullYear();
        const month = String(m.getMonth() + 1).padStart(2, '0');
        const key = `${year}-${month}`;
        let qty = 0;
        filteredList.forEach(x => {
          if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(key)) {
            qty += parseFloat(x.So_Luong) || 0;
          }
        });
        return { label: `Tháng ${m.getMonth() + 1}`, subLabel: `${m.getMonth() + 1}/${year}`, qty };
      });
    }
  };

  // 2. CHUẨN BỊ DATA CHO LINE CHART (TOP 5 THỰC TẾ)
  const getTop5Data = (timeRange, filteredList) => {
    const now = new Date();
    const itemCounts = {};
    filteredList.forEach(x => {
      const name = x.Ten || 'Chưa đặt tên';
      const qty = parseFloat(x.So_Luong) || 0;
      itemCounts[name] = (itemCounts[name] || 0) + qty;
    });

    const topNames = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .map(e => e[0])
      .slice(0, 5);

    const lineData = [];

    if (timeRange === '30') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const dateStr = formatDateKey(d);
        const row = { name: `Ngày ${d.getDate()}`, dateStr };
        
        topNames.forEach(name => {
          row[name] = 0;
        });

        filteredList.forEach(x => {
          if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(dateStr)) {
            const name = x.Ten || 'Chưa đặt tên';
            if (topNames.includes(name)) {
              row[name] += parseFloat(x.So_Luong) || 0;
            }
          }
        });
        lineData.push(row);
      }
    } else if (timeRange === '90') {
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - (i * 7 + 6));
        const end = new Date(now);
        end.setDate(now.getDate() - (i * 7));
        const row = { name: `Tuần ${12 - i}` };
        
        topNames.forEach(name => {
          row[name] = 0;
        });

        filteredList.forEach(x => {
          if (x.Ngay_Xuat) {
            const xDate = new Date(x.Ngay_Xuat);
            if (xDate >= start && xDate <= end) {
              const name = x.Ten || 'Chưa đặt tên';
              if (topNames.includes(name)) {
                row[name] += parseFloat(x.So_Luong) || 0;
              }
            }
          }
        });
        lineData.push(row);
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = m.getFullYear();
        const month = String(m.getMonth() + 1).padStart(2, '0');
        const key = `${year}-${month}`;
        const row = { name: `${m.getMonth() + 1}/${year}` };
        
        topNames.forEach(name => {
          row[name] = 0;
        });

        filteredList.forEach(x => {
          if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(key)) {
            const name = x.Ten || 'Chưa đặt tên';
            if (topNames.includes(name)) {
              row[name] += parseFloat(x.So_Luong) || 0;
            }
          }
        });
        lineData.push(row);
      }
    }

    return { topNames, lineData };
  };


  // 3. CHUẨN BỊ DATA CHO BAR CHART DỰ ÁN (THỰC TẾ)
  const getBarData = (timeRange, filteredList) => {
    const now = new Date();
    const uniquePurposes = [...new Set(filteredList.map(x => x.Muc_Dich || 'Khác'))].filter(p => p !== '').slice(0, 5);

    let barData = [];

    if (timeRange === '30') {
      const weeks = [
        { name: 'Tuần 1', start: 0, end: 6 },
        { name: 'Tuần 2', start: 7, end: 13 },
        { name: 'Tuần 3', start: 14, end: 20 },
        { name: 'Tuần 4', start: 21, end: 29 }
      ];
      const days = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        days.push(d);
      }
      barData = weeks.map(w => {
        const row = { name: w.name };
        uniquePurposes.forEach(p => {
          row[p] = 0;
        });

        for (let idx = w.start; idx <= w.end; idx++) {
          const dateStr = formatDateKey(days[idx]);
          filteredList.forEach(x => {
            if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(dateStr)) {
              const p = x.Muc_Dich || 'Khác';
              if (uniquePurposes.includes(p)) {
                row[p] += parseFloat(x.So_Luong) || 0;
              }
            }
          });
        }
        return row;
      });
    } else if (timeRange === '90') {
      const months = [];
      for (let i = 2; i >= 0; i--) {
        const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(m);
      }
      barData = months.map(m => {
        const year = m.getFullYear();
        const month = String(m.getMonth() + 1).padStart(2, '0');
        const key = `${year}-${month}`;
        const row = { name: `${m.getMonth() + 1}/${year}` };
        uniquePurposes.forEach(p => {
          row[p] = 0;
        });

        filteredList.forEach(x => {
          if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(key)) {
            const p = x.Muc_Dich || 'Khác';
            if (uniquePurposes.includes(p)) {
              row[p] += parseFloat(x.So_Luong) || 0;
            }
          }
        });
        return row;
      });
    } else {
      const quarters = [];
      for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i * 3);
        quarters.push(d);
      }
      barData = quarters.map((q, idx) => {
        const row = { name: `Quý ${Math.floor(q.getMonth() / 3) + 1} - ${q.getFullYear()}` };
        uniquePurposes.forEach(p => {
          row[p] = 0;
        });

        const qStartMonth = Math.floor(q.getMonth() / 3) * 3;
        for (let mOffset = 0; mOffset < 3; mOffset++) {
          const mKey = `${q.getFullYear()}-${String(qStartMonth + mOffset + 1).padStart(2, '0')}`;
          filteredList.forEach(x => {
            if (x.Ngay_Xuat && x.Ngay_Xuat.startsWith(mKey)) {
              const p = x.Muc_Dich || 'Khác';
              if (uniquePurposes.includes(p)) {
                row[p] += parseFloat(x.So_Luong) || 0;
              }
            }
          });
        }
        return row;
      });
    }

    return { purposes: uniquePurposes, barData };
  };

  // 1. Component Heatmap
  const HeatmapComponent = ({ heatmapData, timeRange }) => {
    const getColorClass = (qty) => {
      if (qty === 0) return 'bg-emerald-950-40';
      if (qty <= 10) return 'bg-emerald-950-40';
      if (qty <= 30) return 'bg-emerald-900-60';
      if (qty <= 70) return 'bg-emerald-800-80';
      if (qty <= 120) return 'bg-emerald-600';
      return 'bg-emerald-400';
    };

    const getDescText = () => {
      if (timeRange === '30') return 'Tần suất xuất kho theo ngày trong 30 ngày qua';
      if (timeRange === '90') return 'Tần suất xuất kho gộp theo tuần trong 90 ngày qua';
      return 'Tần suất xuất kho gộp theo tháng trong 1 năm qua';
    };

    return el('div', { className: 'card', style: { margin: 0, padding: '1.25rem' } },
      el('div', { className: 'flex justify-between items-center mb-4', style: { flexWrap: 'wrap', gap: '0.5rem' } },
        el('div', { className: 'flex items-center gap-2' },
          el('span', { style: { fontSize: '1.25rem' } }, '📅'),
          el('div', null,
            el('div', { style: { fontWeight: '600', fontSize: '0.95rem' } }, 'Lịch Sử Rút Kho (Heatmap)'),
            el('div', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }, getDescText())
          )
        ),
        el('div', { className: 'flex items-center gap-2', style: { fontSize: '0.75rem', color: 'var(--text-muted)' } },
          el('span', null, 'Ít'),
          el('div', { className: 'flex gap-1' },
            el('div', { className: 'w-3 h-3 rounded bg-emerald-950-40' }),
            el('div', { className: 'w-3 h-3 rounded bg-emerald-900-60' }),
            el('div', { className: 'w-3 h-3 rounded bg-emerald-800-80' }),
            el('div', { className: 'w-3 h-3 rounded bg-emerald-600' }),
            el('div', { className: 'w-3 h-3 rounded bg-emerald-400' })
          ),
          el('span', null, 'Nhiều')
        )
      ),
      el('div', { className: 'heatmap-grid' },
        heatmapData.map((item, idx) =>
          el('div', { key: idx, className: `heatmap-cell ${getColorClass(item.qty)}` },
            el('span', { style: { fontSize: '0.65rem', opacity: 0.7 } }, item.label.split(' ')[0]),
            el('span', { style: { fontSize: '1.1rem', fontWeight: '700' } }, item.label.split(' ')[1] || item.label),
            el('span', { style: { fontSize: '0.65rem', marginTop: '2px', opacity: 0.9 } }, item.qty === 0 ? '' : `${item.qty}`),
            el('div', { className: 'tooltip-box' },
              el('span', { style: { fontWeight: '600', color: '#34d399' } }, item.label),
              el('span', { style: { fontSize: '0.7rem', color: '#9ca3af' } }, `Thời gian: ${item.subLabel}`),
              el('span', null, `Tổng xuất: ${item.qty}`),
              el('div', { className: 'tooltip-arrow' })
            )
          )
        )
      )
    );
  };

  // 2. Component Line Chart Top 5
  const Top5LineChartComponent = ({ topNames, lineFinalData }) => {
    const [visibleLines, setVisibleLines] = useState(
      topNames.reduce((acc, name) => {
        acc[name] = true;
        return acc;
      }, {})
    );

    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#64748b'
    ];

    const handleLegendClick = (o) => {
      const { dataKey } = o;
      setVisibleLines(prev => ({
        ...prev,
        [dataKey]: !prev[dataKey]
      }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return el('div', { style: { background: '#0b0f19', border: '1px solid #1f2937', borderRadius: '8px', padding: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' } },
          el('p', { style: { fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 0.4rem 0', fontWeight: '600' } }, label),
          el('div', { className: 'flex flex-col', style: { gap: '0.35rem' } },
            payload.map((p, index) => 
              el('div', { key: index, className: 'flex items-center justify-between', style: { fontSize: '0.75rem', gap: '1rem' } },
                el('span', { className: 'flex items-center gap-1', style: { color: p.color } },
                  el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color, display: 'inline-block' } }),
                  p.name
                ),
                el('span', { style: { fontWeight: '700', color: '#f9fafb' } }, `${p.value} đv`)
              )
            )
          )
        );
      }
      return null;
    };

    return el('div', { className: 'card h-full flex flex-col justify-between', style: { margin: 0, padding: '1.25rem' } },
      el('div', { className: 'card-header mb-4' },
        el('div', { className: 'flex items-center gap-2' },
          el('span', { style: { fontSize: '1.25rem' } }, '📈'),
          el('div', null,
            el('div', { style: { fontWeight: '600', fontSize: '0.95rem' } }, 'Biểu đồ biến động Top 5'),
            el('div', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }, 'Biến động lượng xuất kho (Click legend để bật/tắt)')
          )
        )
      ),
      el('div', { className: 'flex-grow-1 w-full', style: { height: '300px' } },
        el(ResponsiveContainer, { width: '100%', height: '100%' },
          el(LineChart, { data: lineFinalData, margin: { top: 10, right: 10, left: -20, bottom: 0 } },
            el(CartesianGrid, { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.06)' }),
            el(XAxis, { dataKey: 'name', stroke: '#64748b', fontSize: 10, tickLine: false, axisLine: false, dy: 10 }),
            el(YAxis, { stroke: '#64748b', fontSize: 10, tickLine: false, axisLine: false, dx: -5 }),
            el(Tooltip, { content: el(CustomTooltip) }),
            el(Legend, { onClick: handleLegendClick, wrapperStyle: { fontSize: '11px', paddingTop: '15px' }, iconType: 'circle', cursor: 'pointer' }),
            topNames.map((key, index) => 
              el(Line, { key: key, type: 'monotone', dataKey: key, stroke: colors[index % colors.length], strokeWidth: 2, dot: { r: 0 }, activeDot: { r: 4, strokeWidth: 0 }, hide: !visibleLines[key] })
            )
          )
        )
      )
    );
  };

  // 3. Component Stacked Bar Chart Phân bổ
  const ProjectDistributionComponent = ({ purposes, barFinalData }) => {
    const colors = [
      '#3b82f6',
      '#10b981',
      '#64748b',
      '#8b5cf6',
      '#f59e0b'
    ];

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const total = payload.reduce((sum, entry) => sum + entry.value, 0);
        return el('div', { style: { background: '#0b0f19', border: '1px solid #1f2937', borderRadius: '8px', padding: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' } },
          el('p', { style: { fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 0.4rem 0', fontWeight: '600' } }, label),
          el('div', { className: 'flex flex-col', style: { gap: '0.35rem' } },
            payload.map((p, index) => 
              el('div', { key: index, className: 'flex items-center justify-between', style: { fontSize: '0.75rem', gap: '1rem' } },
                el('span', { className: 'flex items-center gap-1', style: { color: p.color } },
                  el('span', { style: { width: '8px', height: '8px', borderRadius: '2px', backgroundColor: p.color, display: 'inline-block' } }),
                  p.name
                ),
                el('span', { style: { fontWeight: '700', color: '#f9fafb' } }, `${p.value} đv`)
              )
            ),
            el('div', { style: { borderTop: '1px solid #1f2937', paddingTop: '0.4rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: '#10b981' } },
              el('span', null, 'Tổng cộng:'),
              el('span', null, `${total} đv`)
            )
          )
        );
      }
      return null;
    };

    return el('div', { className: 'card h-full flex flex-col justify-between', style: { margin: 0, padding: '1.25rem' } },
      el('div', { className: 'card-header mb-4' },
        el('div', { className: 'flex items-center gap-2' },
          el('span', { style: { fontSize: '1.25rem' } }, '📊'),
          el('div', null,
            el('div', { style: { fontWeight: '600', fontSize: '0.95rem' } }, 'Phân bổ theo Dự án'),
            el('div', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }, 'Lượng tiêu thụ tích lũy xếp chồng theo mục đích')
          )
        )
      ),
      el('div', { className: 'flex-grow-1 w-full', style: { height: '300px' } },
        el(ResponsiveContainer, { width: '100%', height: '100%' },
          el(BarChart, { data: barFinalData, margin: { top: 10, right: 10, left: -20, bottom: 0 } },
            el(CartesianGrid, { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.06)' }),
            el(XAxis, { dataKey: 'name', stroke: '#64748b', fontSize: 10, tickLine: false, axisLine: false, dy: 10 }),
            el(YAxis, { stroke: '#64748b', fontSize: 10, tickLine: false, axisLine: false, dx: -5 }),
            el(Tooltip, { content: el(CustomTooltip) }),
            el(Legend, { wrapperStyle: { fontSize: '11px', paddingTop: '15px' }, iconType: 'square' }),
            purposes.map((p, index) => 
              el(Bar, { key: p, dataKey: p, stackId: 'a', fill: colors[index % colors.length], radius: index === purposes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0] })
            )
          )
        )
      )
    );
  };

  // 4. Main App Layout component
  const AppLayout = () => {
    const [timeRange, setTimeRange] = useState('30');

    const filteredExports = getFilteredExports(timeRange);
    const hasData = filteredExports.length > 0;

    const heatmapData = getHeatmapData(timeRange, filteredExports);
    const { topNames, lineData } = getTop5Data(timeRange, filteredExports);
    const { purposes, barData } = getBarData(timeRange, filteredExports);

    return el('div', { className: 'react-dashboard-container' },
      el('div', { className: 'flex justify-between items-center mb-4 pb-2', style: { borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' } },
        el('div', null,
          el('h2', { style: { fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 } }, '📊 Báo Cáo Phân Tích & Thống Kê Kho'),
          el('p', { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' } }, 'Dữ liệu thời gian thực được tổng hợp tự động từ nhật ký xuất kho')
        ),
        el('div', { className: 'flex items-center gap-2' },
          el('span', { style: { fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' } }, 'Xem theo:'),
          el('select', { 
            className: 'table-input',
            style: { maxWidth: '240px', fontSize: '0.85rem', padding: '0.4rem 0.8rem', cursor: 'pointer', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)' },
            value: timeRange,
            onChange: (e) => setTimeRange(e.target.value)
          },
            el('option', { value: '30' }, '30 Ngày Gần Nhất (Tháng)'),
            el('option', { value: '90' }, '90 Ngày Gần Nhất (Quý)'),
            el('option', { value: '365' }, '1 Năm Gần Nhất (Năm)')
          )
        )
      ),
      !hasData ? 
        el('div', { 
          style: { 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '5rem 2rem', 
            background: 'var(--bg-card)', 
            border: '1px dashed var(--border)', 
            borderRadius: '12px', 
            marginTop: '2rem',
            textAlign: 'center'
          } 
        },
          el('span', { style: { fontSize: '3rem', marginBottom: '1rem' } }, '📈'),
          el('h3', { style: { fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 0.5rem 0' } }, 'Chưa có dữ liệu thống kê'),
          el('p', { style: { fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, maxWidth: '440px', lineHeight: '1.5' } }, 'Phòng thí nghiệm chưa ghi nhận bất kỳ hoạt động xuất kho thực tế nào trong khoảng thời gian này.')
        )
      :
        el('div', { className: 'react-dashboard-grid' },
          el('div', { className: 'grid-col-full' }, el(HeatmapComponent, { heatmapData, timeRange })),
          el('div', { className: 'grid-col-60' }, el(Top5LineChartComponent, { topNames, lineFinalData: lineData })),
          el('div', { className: 'grid-col-40' }, el(ProjectDistributionComponent, { purposes, barFinalData: barData }))
        )
    );
  };

  // Render to DOM using ReactDOM.createRoot
  try {
    if (!window.reactDashboardRoot) {
      window.reactDashboardRoot = ReactDOM.createRoot(rootEl);
    }
    window.reactDashboardRoot.render(el(AppLayout));
  } catch (err) {
    console.error("React render error: ", err);
    try {
      ReactDOM.render(el(AppLayout), rootEl);
    } catch (e) {
      console.error("React render fallback error: ", e);
    }
  }
};

let activeReplacementRequestId = null;

window.openReplacementModal = function(reqId) {
  activeReplacementRequestId = reqId;
  const modal = document.getElementById('replacement-modal-overlay');
  if (modal) {
    modal.classList.add('active');
  }
  document.getElementById('replacement-search-input').value = '';
  searchReplacementItems();
};

window.closeReplacementModal = function() {
  const modal = document.getElementById('replacement-modal-overlay');
  if (modal) {
    modal.classList.remove('active');
  }
  activeReplacementRequestId = null;
};

window.searchReplacementItems = function() {
  const tbody = document.getElementById('replacement-items-tbody');
  if (!tbody || !appData) return;
  
  const query = (document.getElementById('replacement-search-input').value || '').toLowerCase().trim();
  tbody.innerHTML = '';
  
  const items = appData.inventory.filter(item => {
    if (!query) return true;
    return (item.Ten || '').toLowerCase().includes(query) ||
           (item.Hang || '').toLowerCase().includes(query) ||
           (item.Ma_So || '').toLowerCase().includes(query);
  });
  
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1rem;">Không tìm thấy hóa chất phù hợp.</td></tr>`;
    return;
  }
  
  items.slice(0, 10).forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="font-family: monospace; font-size: 0.8rem;">${item.Ma_So || '-'}</span></td>
      <td><strong>${item.Ten}</strong></td>
      <td><span class="badge badge-primary">${item.Hang || '-'}</span></td>
      <td>${item.Quy_Cach || '-'}</td>
      <td><span style="font-weight:600; color: ${item.So_Luong > 0 ? 'var(--success)' : 'var(--danger)'};">${item.So_Luong} ${item.Don_Vi || 'cái'}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-success btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="selectReplacementItem('${item.ID}')">Chọn</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.selectReplacementItem = function(itemId) {
  if (!activeReplacementRequestId) return;
  const req = appData.requests.find(r => r.ID_Yeu_Cau === activeReplacementRequestId);
  const selectedItem = appData.inventory.find(i => i.ID === itemId);
  
  if (req && selectedItem) {
    if (!req.originalItemName) {
      req.originalItemName = req.Ten;
      req.originalItemBrand = req.Hang;
    }
    
    req.ID_Vat_Tu = selectedItem.ID;
    req.Ten = selectedItem.Ten;
    req.Hang = selectedItem.Hang;
    req.Quy_Cach = selectedItem.Quy_Cach;
    req.Don_Vi = selectedItem.Don_Vi;
    req.replacementItemId = selectedItem.ID;
    
    showToast(`Đã đổi yêu cầu thành: ${selectedItem.Ten} (${selectedItem.Hang})`, 'success');
    closeReplacementModal();
    renderAdminRequests();
  }
};

// --- HỆ THỐNG TRƯỜNG DỮ LIỆU TÙY CHỈNH (CUSTOM FIELDS) ---
function getCustomFieldValue(item, fieldId) {
  if (!item || !item.Dac_Tinh_Ky_Thuat) return '';
  try {
    let parsed = item.Dac_Tinh_Ky_Thuat;
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    if (parsed && parsed.customFields) {
      return parsed.customFields[fieldId] || '';
    }
  } catch (e) {
    // Không phải JSON
  }
  return '';
}

function getTechSpecsText(item) {
  if (!item || !item.Dac_Tinh_Ky_Thuat) return '';
  try {
    let parsed = item.Dac_Tinh_Ky_Thuat;
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    if (parsed && parsed.specText !== undefined) {
      return parsed.specText;
    }
  } catch (e) {
    // Không phải JSON
  }
  return item.Dac_Tinh_Ky_Thuat;
}

window.renderCustomFieldsSettings = function() {
  const tbody = document.getElementById('custom-fields-settings-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const customFields = appConfig.customFields || [];
  if (customFields.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">Chưa có trường dữ liệu tùy chỉnh nào.</td></tr>`;
    return;
  }
  
  customFields.forEach(cf => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(cf.label)}</strong></td>
      <td><span style="font-family: monospace;">${escapeHtml(cf.key)}</span></td>
      <td><span>${escapeHtml(cf.defaultValue || '-')}</span></td>
      <td style="text-align: center;">
        <button class="btn btn-danger btn-sm" onclick="deleteCustomFieldConfig('${cf.key}')">Xóa 🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.addCustomFieldConfig = async function() {
  const labelInput = document.getElementById('new-cf-label');
  const keyInput = document.getElementById('new-cf-key');
  const defaultInput = document.getElementById('new-cf-default');
  
  if (!labelInput || !keyInput || !defaultInput) return;
  
  const label = labelInput.value.trim();
  const key = keyInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const defaultValue = defaultInput.value.trim();
  
  if (!label || !key) {
    alert("Vui lòng nhập đầy đủ tên trường và mã trường!");
    return;
  }
  
  if (!appConfig.customFields) appConfig.customFields = [];
  
  if (appConfig.customFields.some(cf => cf.key === key)) {
    alert("Mã trường này đã tồn tại!");
    return;
  }
  
  appConfig.customFields.push({ label, key, defaultValue });
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  
  labelInput.value = '';
  keyInput.value = '';
  defaultInput.value = '';
  
  renderCustomFieldsSettings();
  renderInventory();
  renderDynamicCustomFieldInputs();
  
  // Lưu lên Supabase
  showLoading(true);
  try {
    await sendRequest({ action: 'save_config', config: appConfig });
  } catch (err) {
    console.error('Lỗi đồng bộ cấu hình trường tùy chỉnh:', err);
  }
  showLoading(false);
};

window.deleteCustomFieldConfig = async function(key) {
  if (!confirm("Bạn có chắc chắn muốn xóa trường tùy chọn này không? (Dữ liệu đã nhập của hóa chất sẽ không bị mất nhưng sẽ tạm ẩn đi)")) return;
  
  if (!appConfig.customFields) appConfig.customFields = [];
  appConfig.customFields = appConfig.customFields.filter(cf => cf.key !== key);
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  
  renderCustomFieldsSettings();
  renderInventory();
  renderDynamicCustomFieldInputs();
  
  // Lưu lên Supabase
  showLoading(true);
  try {
    await sendRequest({ action: 'save_config', config: appConfig });
  } catch (err) {
    console.error('Lỗi đồng bộ cấu hình trường tùy chỉnh:', err);
  }
  showLoading(false);
};

// Render các input động cho Custom Fields ở form nhập và sửa
window.renderDynamicCustomFieldInputs = function(currentItem = null) {
  const editContainer = document.getElementById('edit-custom-fields-container');
  const importContainer = document.getElementById('import-custom-fields-container');
  const customFields = appConfig.customFields || [];
  const isStudent = currentRole === 'student';
  
  if (editContainer) {
    editContainer.innerHTML = '';
    customFields.forEach(cf => {
      const val = currentItem ? getCustomFieldValue(currentItem, cf.key) : '';
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label" for="edit-cf-${cf.key}">${escapeHtml(cf.label)}</label>
        <input type="text" id="edit-cf-${cf.key}" class="form-control edit-custom-field-input" data-key="${cf.key}" value="${escapeHtml(val || cf.defaultValue || '')}" ${isStudent ? 'disabled' : ''}>
      `;
      editContainer.appendChild(div);
    });
  }
  
  if (importContainer) {
    importContainer.innerHTML = '';
    customFields.forEach(cf => {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label" for="import-cf-${cf.key}">${escapeHtml(cf.label)}</label>
        <input type="text" id="import-cf-${cf.key}" class="form-control import-custom-field-input" data-key="${cf.key}" value="${escapeHtml(cf.defaultValue || '')}">
      `;
      importContainer.appendChild(div);
    });
  }
};

// --- ADMIN: KHÔI PHỤC DỮ LIỆU VỀ PHIÊN BẢN CŨ (ROLLBACK) ---
window.rollbackEdit = async function(logId) {
  if (!confirm("Bạn có chắc chắn muốn khôi phục thông tin vật tư về phiên bản này không?")) return;
  
  showLoading(true);
  const userRoleLabel = currentRole === 'admin' ? 'Admin' : (currentRole === 'exporter' ? 'Người xuất kho' : 'Người nhập kho');
  
  const payload = {
    action: 'rollback_edit',
    logId: logId,
    user: userRoleLabel,
    pin: appConfig.adminPin
  };
  
  try {
    const json = await sendRequest(payload);
    if (json.success) {
      showToast("Khôi phục phiên bản thông tin thành công!", 'success');
      await loadData();
    } else {
      throw new Error(json.message);
    }
  } catch(err) {
    console.error(err);
    showToast("Không thể khôi phục dữ liệu: " + err.message, 'danger');
  }
  showLoading(false);
};

// --- QUẢN LÝ DANH SÁCH YÊU CẦU ĐÃ HỦY CỦA NGƯỜI DÙNG ---
window.renderCancelledRequests = function() {
  const tbody = document.getElementById('my-cancelled-requests-table-body');
  if (!tbody || !appData) return;
  
  tbody.innerHTML = '';
  const isStudent = currentRole === 'student';
  const cancelledList = (!appData.requests ? [] : appData.requests).filter(req => {
    if (req.Trang_Thai !== 'Da_Huy') return false;
    if (isStudent) {
      return req.Nguoi_Yeu_Cau && req.Nguoi_Yeu_Cau.toString().includes("Sinh viên");
    }
    return req.Nguoi_Yeu_Cau && !req.Nguoi_Yeu_Cau.toString().includes("Sinh viên");
  });
  
  const grouped = groupRequests(cancelledList);
  grouped.sort((a, b) => new Date(b.Ngay_Yeu_Cau).getTime() - new Date(a.Ngay_Yeu_Cau).getTime());
  
  if (grouped.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Không có yêu cầu nào bị hủy gần đây.</td></tr>`;
    return;
  }
  
  grouped.forEach(group => {
    const tr = document.createElement('tr');
    const dateStr = group.Ngay_Yeu_Cau ? new Date(group.Ngay_Yeu_Cau).toLocaleString('vi-VN') : '-';
    
    // Vẽ danh sách vật tư dạng bảng con để căn chỉnh hoàn hảo
    const subTableHtml = `
      <td style="padding: 0;">
        <table style="width: 100%; border-collapse: collapse; background: transparent; margin: 0;">
          <tbody>
            ${group.items.map((it, idx) => `
              <tr style="border-bottom: 1px solid var(--border); background: transparent;">
                <td style="padding: 0.5rem; border: none; font-size: 0.85rem;">
                  <strong>${idx + 1}. ${escapeHtml(it.Ten)}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">
                    (${escapeHtml(it.Hang || 'K/P')} - ${escapeHtml(it.Quy_Cach || 'K/P')})
                  </span>
                </td>
                <td style="padding: 0.5rem; border: none; width: 90px; text-align: right; font-weight: 600;">
                  ${it.So_Luong_Yeu_Cau} ${it.Don_Vi || 'Cái'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </td>
    `;

    const reqIdsStr = group.items.map(it => it.ID_Yeu_Cau).join(',');

    tr.innerHTML = `
      ${subTableHtml}
      <td>${escapeHtml(group.Nguoi_Yeu_Cau || '-')}</td>
      <td><span style="font-size: 0.85rem;">${dateStr}</span></td>
      <td style="text-align: right;">
        <button type="button" class="btn btn-success btn-sm" onclick="undoCancelledRequest('${reqIdsStr}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">♻️ Hoàn tác</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.undoCancelledRequest = async function(reqId) {
  const ids = reqId.split(',');
  showLoading(true);
  
  // Xóa trên Supabase trước
  initSupabase();
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient.from('yeu_cau_xuat').delete().in('id_yeu_cau', ids);
      if (error) throw error;
    } catch(err) {
      console.error("Lỗi xóa yêu cầu đã hủy khi hoàn tác:", err);
    }
  }
  
  // Đưa tất cả vật tư trở lại giỏ hàng
  ids.forEach(id => {
    const req = appData.requests.find(r => r.ID_Yeu_Cau === id);
    if (!req) return;

    const existingCartItem = cart.find(c => c.itemId === req.ID_Vat_Tu);
    if (existingCartItem) {
      existingCartItem.qty += parseFloat(req.So_Luong_Yeu_Cau) || 1;
    } else {
      cart.push({
        itemId: req.ID_Vat_Tu,
        code: req.Ma_So || '',
        name: req.Ten,
        brand: req.Hang || '',
        spec: req.Quy_Cach || '',
        qty: parseFloat(req.So_Luong_Yeu_Cau) || 1,
        unit: req.Don_Vi || 'Cái',
        maxQty: currentRole === 'student' ? 9999 : 9999, // Allow 9999 for student to prevent guessing
        selected: true
      });
    }
  });
  
  // Cập nhật local và render lại
  appData.requests = appData.requests.filter(r => !ids.includes(r.ID_Yeu_Cau));
  saveMockData();
  saveCart();
  updateCartBadge();
  renderCart();
  renderCancelledRequests();
  showLoading(false);
  showToast(`Đã hoàn tác đưa các vật tư trở lại giỏ hàng!`, 'success');
};

// ============================================================
// === 1. TÍNH NĂNG IN PHIẾU XUẤT KHO / BÀN GIAO VẬT TƯ LAB ===
// ============================================================
window.openPrintExportModal = function(txIdsStr) {
  if (!txIdsStr || !appData || !appData.exports) return;
  const ids = txIdsStr.split(',').map(s => s.trim());
  const exportsList = appData.exports.filter(e => ids.includes(e.ID_Giao_Dich));
  
  if (exportsList.length === 0) {
    showToast('Không tìm thấy thông tin đơn xuất kho để in!', 'warning');
    return;
  }

  const firstExp = exportsList[0];
  const dateStr = firstExp.Ngay_Xuat ? new Date(firstExp.Ngay_Xuat).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');

  const vOrgTitle = document.getElementById('voucher-org-title');
  const vOrgSub = document.getElementById('voucher-org-sub');
  const vDate = document.getElementById('voucher-date');
  const vCode = document.getElementById('voucher-code');
  const vRecip = document.getElementById('voucher-recipient');
  const vExp = document.getElementById('voucher-exporter');
  const vPurp = document.getElementById('voucher-purpose');
  const vNote = document.getElementById('voucher-note');
  const vSigRecip = document.getElementById('voucher-sig-recipient-name');
  const vSigExp = document.getElementById('voucher-sig-exporter-name');

  const defaultExporter = appConfig.exporterName || 'Người xuất kho';
  const currentExporter = firstExp.Nguoi_Xuat || defaultExporter;

  if (vOrgTitle) vOrgTitle.textContent = appConfig.labOrgName || 'HỆ THỐNG QUẢN LÝ PHÒNG THÍ NGHIỆM';
  if (vOrgSub) vOrgSub.textContent = appConfig.labRoomName || 'Phòng Thí Nghiệm CNSH Thực Phẩm';
  if (vDate) vDate.textContent = dateStr;
  if (vCode) vCode.textContent = ids.join(', ');
  if (vRecip) vRecip.textContent = firstExp.Nguoi_Nhan || '-';
  if (vExp) vExp.textContent = currentExporter;
  if (vPurp) vPurp.textContent = firstExp.Muc_Dich || 'Nghiên cứu / Thực hành';
  if (vNote) vNote.textContent = exportsList.map(e => e.Ghi_Chu).filter(Boolean).join('; ') || 'Không';
  if (vSigRecip) vSigRecip.textContent = firstExp.Nguoi_Nhan || '(Người nhận)';
  if (vSigExp) vSigExp.textContent = currentExporter;

  const tbody = document.getElementById('voucher-items-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    exportsList.forEach((exp, idx) => {
      const itemInKho = (appData.inventory || []).find(i => i.ID === exp.ID_Vat_Tu || i.Ten === exp.Ten);
      const locationStr = itemInKho ? (itemInKho.Noi_Bao_Quan || '-') : '-';
      const codeStr = itemInKho ? (itemInKho.Ma_So || '-') : '-';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center; font-family: monospace;">${escapeHtml(codeStr)}</td>
        <td><strong>${escapeHtml(exp.Ten)}</strong></td>
        <td>${escapeHtml(exp.Hang || 'K/P')}</td>
        <td>${escapeHtml(exp.Quy_Cach || 'K/P')}</td>
        <td style="text-align: center;">${escapeHtml(exp.Don_Vi || 'Cái')}</td>
        <td style="text-align: right; font-weight: bold; color: #1e3a8a;">${exp.So_Luong}</td>
        <td>${escapeHtml(locationStr)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  const modal = document.getElementById('print-export-modal-overlay');
  if (modal) modal.classList.add('active');
};

window.closePrintExportModal = function() {
  const modal = document.getElementById('print-export-modal-overlay');
  if (modal) modal.classList.remove('active');
};

// SỬA LỖI IN TRANG TRẮNG: Sử dụng Dedicated Print Iframe để in độc lập 100% không bị ảnh hưởng bởi CSS modal
window.triggerPrintVoucher = function() {
  const voucherEl = document.getElementById('print-voucher-area');
  if (!voucherEl) {
    window.print();
    return;
  }

  let printFrame = document.getElementById('dedicated-print-iframe');
  if (printFrame) {
    printFrame.remove();
  }
  printFrame = document.createElement('iframe');
  printFrame.id = 'dedicated-print-iframe';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const doc = printFrame.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Phiếu Xuất Kho - Phòng Thí Nghiệm CNSH Thực Phẩm</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 0; /* Xóa lề mặc định máy in để dùng padding chuẩn bên dưới, đồng thời triệt tiêu header ngày giờ mặc định */
        }
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #000000;
          width: 100%;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          box-sizing: border-box;
          margin: 0 auto;
          /* CĂN LỀ CHUẨN A4 HÀNH CHÍNH: Trên 20mm, Phải 15mm, Dưới 20mm, Trái 25mm (dành cho dập ghim/lưu hồ sơ) */
          padding: 20mm 15mm 20mm 25mm;
          width: 100%;
          max-width: 210mm;
          min-height: 297mm;
          line-height: 1.45;
          font-size: 12pt;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .voucher-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 16px;
        }
        .voucher-org-title {
          font-weight: bold;
          font-size: 12pt;
          text-transform: uppercase;
        }
        .voucher-org-sub {
          font-size: 11pt;
          color: #222;
        }
        .voucher-title {
          text-align: center;
          font-size: 16pt;
          font-weight: bold;
          text-transform: uppercase;
          margin: 14px 0 4px 0;
          letter-spacing: 0.5px;
        }
        .voucher-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px 25px;
          margin: 16px 0;
          font-size: 11.5pt;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 11pt;
        }
        thead {
          display: table-header-group; /* Tự động lặp lại tiêu đề cột nếu phiếu dài sang trang 2 */
        }
        tr {
          page-break-inside: avoid; /* Chống bị cắt ngang dòng chữ giữa 2 trang */
        }
        th, td {
          border: 1px solid #000;
          padding: 6px 8px;
          text-align: left;
        }
        th {
          background: #f2f2f2 !important;
          font-weight: bold;
          text-align: center;
        }
        .voucher-signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          text-align: center;
          margin-top: 25px;
          page-break-inside: avoid;
        }
        .voucher-sig-title {
          font-weight: bold;
          font-size: 11.5pt;
          text-transform: uppercase;
        }
        .voucher-sig-sub {
          font-style: italic;
          font-size: 10.5pt;
          color: #333;
        }
        .voucher-sig-space {
          height: 75px;
        }
        [contenteditable] {
          outline: none;
        }
      </style>
    </head>
    <body>
      ${voucherEl.innerHTML}
    </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
  }, 350);
};

// TÍNH NĂNG TẢI PHIẾU XUẤT KHO VỀ MÁY TÍNH
window.downloadVoucherFile = function() {
  const voucherEl = document.getElementById('print-voucher-area');
  const codeEl = document.getElementById('voucher-code');
  const codeName = (codeEl ? codeEl.textContent : 'XK').replace(/[^a-zA-Z0-9_-]/g, '_');
  
  if (!voucherEl) {
    showToast('Không tìm thấy nội dung phiếu để tải!', 'warning');
    return;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Phiếu Xuất Kho - ${codeName}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      margin: 20px auto;
      max-width: 210mm;
      padding: 20mm 15mm 20mm 25mm; /* Chuẩn A4: Trên 20mm, Phải 15mm, Dưới 20mm, Trái 25mm */
      color: #000;
      background: #fff;
      line-height: 1.45;
      font-size: 12pt;
      border: 1px solid #ddd;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border-radius: 6px;
    }
    .voucher-header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 16px; }
    .voucher-org-title { font-weight: bold; font-size: 12pt; text-transform: uppercase; }
    .voucher-org-sub { font-size: 11pt; color: #333; }
    .voucher-title { text-align: center; font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 14px 0 4px 0; }
    .voucher-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 25px; margin: 16px 0; font-size: 11.5pt; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11pt; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
    th { background: #f0f0f0 !important; font-weight: bold; text-align: center; }
    .voucher-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; text-align: center; margin-top: 25px; page-break-inside: avoid; }
    .voucher-sig-title { font-weight: bold; font-size: 11.5pt; text-transform: uppercase; }
    .voucher-sig-sub { font-style: italic; font-size: 10.5pt; color: #444; }
    .voucher-sig-space { height: 75px; }
    .no-print-bar { background: #17a863; color: #fff; padding: 12px 18px; border-radius: 8px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif; font-size: 14px; }
    .print-btn { background: #fff; color: #17a863; font-weight: bold; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .print-btn:hover { background: #f0fdf4; }
    @media print {
      .no-print-bar { display: none !important; }
      body {
        margin: 0 auto !important;
        padding: 20mm 15mm 20mm 25mm !important;
        max-width: 100% !important;
        width: 100% !important;
        border: none !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>📄 <strong>Phiếu Xuất Kho Đã Tải Về</strong> • Bạn có thể mở xem ngoại tuyến hoặc bấm nút để in / lưu PDF:</span>
    <button class="print-btn" onclick="window.print()">🖨️ In Phiếu Ngay / Lưu PDF</button>
  </div>
  ${voucherEl.innerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Phieu_Xuat_Kho_${codeName}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Đã tải file phiếu xuất kho về máy thành công!', 'success');
};

// ============================================================
// === 5. HỆ THỐNG GHI CHÚ CẬP NHẬT PHIÊN BẢN (WHAT'S NEW) ===
// ============================================================
const CURRENT_VERSION_TAG = 'v1.2';
const APP_CHANGELOG_FEATURES = [
  {
    icon: '🗄️',
    title: 'Bổ sung Tủ Dùng Chung & Cột Mã Số (v1.2 Mới)',
    desc: 'Bổ sung đầy đủ cột <strong>Mã Số</strong> cho Tủ Hóa Chất Dùng Chung đồng bộ với kho chính. Phân quyền Sinh viên xem & bấm Báo Hết, Người nhập kho duyệt xóa, hỗ trợ nạp & tải file Excel mẫu nhanh chóng.'
  },
  {
    icon: '🧭',
    title: 'Thanh điều hướng 2 tầng chống rớt dòng chữ (v1.2 Mới)',
    desc: 'Tách biệt rõ ràng hàng chức năng điều hướng riêng biệt, khoảng cách đều đặn, không bị nhảy dòng tên tab ("Tủ Dùng Chung", "Duyệt & Xuất"). Cụm vai trò, chế độ sáng tối và đăng xuất được gom gọn về góc phải.'
  },
  {
    icon: '📢',
    title: 'Thanh thông báo thu gọn thông minh ~50px (v1.2 Mới)',
    desc: 'Thu gọn khung thông báo cồng kềnh thành thanh banner ngang mỏng nhẹ, có nút <strong>[Xem thêm ▾]</strong> để mở rộng khi cần, giúp nhìn thấy Bảng Tồn Kho ngay lập tức.'
  },
  {
    icon: '🧪',
    title: 'Chuẩn hóa danh pháp hóa chất & Cân đối bảng kho (v1.2 Mới)',
    desc: 'Tự động chuẩn hóa công thức hóa học (<code>naoh</code> → <strong>NaOH</strong>, <code>hno3</code> → <strong>HNO3</strong>, <code>nacl</code> → <strong>NaCl</strong>...). Cân đối độ rộng các cột loại bỏ hoàn toàn lỗ trống thừa, căn phải số lượng và thể hiện rõ ràng dữ liệu thiếu (<em>Chưa cấp mã</em>, <em>Chưa rõ hãng</em>...).'
  },
  {
    icon: '📄',
    title: 'Căn lề chuẩn A4 & In phiếu xuất kho sắc nét',
    desc: 'Căn lề trang in chuẩn mực hành chính (20mm trên/dưới, 25mm trái đóng ghim). Hỗ trợ nút tải file HTML phiếu xuất kho về máy để in ấn và lưu trữ ngoại tuyến.'
  },
  {
    icon: '⚡',
    title: 'Silent Polling 120s & Chống xung đột kho',
    desc: 'Cứ sau mỗi 2 phút, hệ thống tự động kiểm tra ngầm yêu cầu xuất kho mới và đồng bộ số lượng tồn tươi mới nhất từ máy chủ.'
  }
];

window.openChangelogModal = function(force = true) {
  const modal = document.getElementById('changelog-modal-overlay');
  const tagEl = document.getElementById('changelog-version-tag');
  const listEl = document.getElementById('changelog-features-list');

  if (tagEl) tagEl.textContent = CURRENT_VERSION_TAG;
  if (listEl) {
    listEl.innerHTML = APP_CHANGELOG_FEATURES.map(f => `
      <div style="display: flex; gap: 0.75rem; align-items: flex-start; background: var(--bg-app); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border);">
        <span style="font-size: 1.35rem; line-height: 1;">${f.icon}</span>
        <div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">${f.title}</div>
          <div style="font-size: 0.83rem; color: var(--text-secondary); margin-top: 2px;">${f.desc}</div>
        </div>
      </div>
    `).join('');
  }

  if (modal) modal.classList.add('active');
};

window.closeChangelogModal = function(markAsSeen = false) {
  const modal = document.getElementById('changelog-modal-overlay');
  if (modal) modal.classList.remove('active');
  if (markAsSeen) {
    localStorage.setItem('LAB_LAST_SEEN_CHANGELOG', CURRENT_VERSION_TAG);
  }
};

function checkChangelogOnStartup() {
  const lastSeen = localStorage.getItem('LAB_LAST_SEEN_CHANGELOG');
  if (lastSeen !== CURRENT_VERSION_TAG) {
    setTimeout(() => {
      openChangelogModal(false);
    }, 1200);
  }
}


window.saveVoucherOrgDefaults = async function() {
  const vOrgTitle = document.getElementById('voucher-org-title');
  const vOrgSub = document.getElementById('voucher-org-sub');
  const vExp = document.getElementById('voucher-exporter');

  if (vOrgTitle) appConfig.labOrgName = vOrgTitle.textContent.trim();
  if (vOrgSub) appConfig.labRoomName = vOrgSub.textContent.trim();
  if (vExp) appConfig.exporterName = vExp.textContent.trim();

  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
  renderSettings();
  showToast('Đang lưu thông tin phòng và người xuất kho mặc định lên Supabase...', 'info');

  try {
    const payload = {
      action: 'save_config',
      config: appConfig,
      pin: appConfig.adminPin
    };
    await sendRequest(payload);
    showToast('Đã lưu mẫu thông tin phòng và thủ kho mặc định thành công!', 'success');
  } catch(e) {
    showToast('Đã lưu thông tin mặc định cục bộ!', 'success');
  }
};

// ============================================================
// === 2. BỘ LỌC VỊ TRÍ KHO BẢO QUẢN (TỦ/KỆ/TẦNG) ===
// ============================================================
function populateLocationFilter() {
  const select = document.getElementById('filter-location-select');
  if (!select || !appData || !appData.inventory) return;

  const currentVal = selectedLocationFilter || select.value || '';
  const locations = Array.from(new Set(
    appData.inventory.map(i => (i.Noi_Bao_Quan || '').trim()).filter(Boolean)
  )).sort();

  select.innerHTML = '<option value="">📍 Tất cả vị trí (Tủ/Kệ/Tầng)</option>';
  locations.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = `📍 ${loc}`;
    if (loc === currentVal) opt.selected = true;
    select.appendChild(opt);
  });
}

// ============================================================
// === 3. CẢNH BÁO TRÙNG KHI NHẬP KHO & GỢI Ý CỘNG DỒN ===
// ============================================================
function checkDuplicateImport() {
  const nameInput = document.getElementById('import-name');
  const codeInput = document.getElementById('import-code');
  const alertEl = document.getElementById('import-duplicate-alert');
  if (!nameInput || !alertEl || !appData || !appData.inventory) return;

  const rawName = (nameInput.value || '').trim();
  const rawCode = codeInput ? (codeInput.value || '').trim() : '';

  if (rawName.length < 2 && rawCode.length < 2) {
    alertEl.style.display = 'none';
    alertEl.innerHTML = '';
    return;
  }

  const cleanName = removeVietnameseTones(rawName.toLowerCase());
  const cleanCode = rawCode.toLowerCase();

  const matches = appData.inventory.filter(item => {
    const itemName = removeVietnameseTones((item.Ten || '').toLowerCase());
    const itemCode = (item.Ma_So || '').toLowerCase();
    
    if (cleanCode && itemCode && itemCode === cleanCode) return true;
    if (cleanName.length >= 3 && itemName === cleanName) return true;
    if (cleanName.length >= 4 && (itemName.includes(cleanName) || cleanName.includes(itemName))) return true;
    return false;
  });

  if (matches.length > 0) {
    const match = matches[0];
    alertEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
        <div>
          <div style="font-weight: 700; display: flex; align-items: center; gap: 0.4rem; color: #b45309;">
            ⚠️ Phát hiện vật tư tương tự trong kho:
          </div>
          <div style="margin-top: 0.25rem;">
            <strong>${escapeHtml(match.Ten)}</strong> 
            <span style="color: var(--text-muted);">(${escapeHtml(match.Hang || 'K/P')} - ${escapeHtml(match.Quy_Cach || 'K/P')})</span>
          </div>
          <div style="font-size: 0.82rem; margin-top: 0.2rem;">
            📍 Vị trí: <strong>${escapeHtml(match.Noi_Bao_Quan || 'Chưa rõ')}</strong> • Hiện tồn: <strong style="color: var(--success);">${match.So_Luong} ${escapeHtml(match.Don_Vi || '')}</strong>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-primary" style="white-space: nowrap; font-size: 0.78rem; padding: 0.35rem 0.65rem;" onclick="applyExistingItemForImport('${match.ID}')">
          ➕ Cộng dồn vào vật tư này
        </button>
      </div>
    `;
    alertEl.style.display = 'block';
  } else {
    alertEl.style.display = 'none';
    alertEl.innerHTML = '';
  }
}

window.applyExistingItemForImport = function(itemId) {
  const item = (appData.inventory || []).find(i => i.ID === itemId);
  if (!item) return;

  const codeInput = document.getElementById('import-code');
  const nameInput = document.getElementById('import-name');
  const brandSelect = document.getElementById('import-brand');
  const specSelect = document.getElementById('import-spec');
  const locationInput = document.getElementById('import-location');
  const unitSelect = document.getElementById('import-unit');

  if (codeInput && item.Ma_So) codeInput.value = item.Ma_So;
  if (nameInput) nameInput.value = item.Ten;
  if (locationInput) locationInput.value = item.Noi_Bao_Quan || '';
  if (brandSelect && item.Hang) brandSelect.value = item.Hang;
  if (specSelect && item.Quy_Cach) specSelect.value = item.Quy_Cach;
  if (unitSelect && item.Don_Vi) unitSelect.value = item.Don_Vi;

  const alertEl = document.getElementById('import-duplicate-alert');
  if (alertEl) {
    alertEl.innerHTML = `
      <div style="color: var(--success); font-weight: 600;">
        ✅ Đã chọn cộng dồn vào vật tư: <strong>${escapeHtml(item.Ten)}</strong> (Hiện tồn: ${item.So_Luong} ${escapeHtml(item.Don_Vi)}). Vui lòng nhập số lượng cần cộng thêm bên dưới!
      </div>
    `;
  }
  showToast(`Đã tự động điền thông tin để cộng dồn vào: ${item.Ten}`, 'success');
};

// ============================================================
// === 4. CƠ CHẾ SILENT POLLING (TỰ ĐỘNG CẬP NHẬT NGẦM 120s) ===
// ============================================================
let silentPollingTimer = null;

function initSilentPolling() {
  if (silentPollingTimer) clearInterval(silentPollingTimer);
  
  silentPollingTimer = setInterval(async () => {
    // Chỉ chạy nếu người dùng đã đăng nhập và đang mở tab trình duyệt
    const hasSession = checkUserSession();
    if (!hasSession || document.hidden) return;
    
    await silentCheckUpdates();
  }, 120000); // 120 giây
}

async function silentCheckUpdates() {
  if (!supabaseClient) initSupabase();
  if (supabaseClient) {
    try {
      const [reqRes, specRes] = await Promise.all([
        supabaseClient.from('yeu_cau_xuat').select('*'),
        supabaseClient.from('yeu_cau_dac_tinh').select('*')
      ]);
      
      if (!reqRes.error && reqRes.data && appData) {
        const freshRequests = reqRes.data.map(r => ({
          ID_Yeu_Cau: r.id_yeu_cau,
          ID_Vat_Tu: r.id_vat_tu,
          Ten: r.ten,
          Hang: r.hang || '',
          Quy_Cach: r.quy_cach || '',
          So_Luong_Yeu_Cau: parseFloat(r.so_luong_yeu_cau) || 0,
          Don_Vi: r.don_vi,
          Nguoi_Yeu_Cau: r.nguoi_yeu_cau,
          Muc_Dich: r.muc_dich,
          Ngay_Yeu_Cau: r.ngay_yeu_cau,
          Trang_Thai: r.trang_thai,
          Ghi_Chu: r.ghi_chu
        }));
        
        const freshSpecs = (specRes.data || []).map(s => ({
          ID_De_Xuat: s.id_de_xuat,
          ID_Vat_Tu: s.id_vat_tu,
          Ten_Vat_Tu: s.ten_vat_tu,
          Dac_Tinh_De_Xuat: s.dac_tinh_de_xuat,
          Ngay_De_Xuat: s.ngay_de_xuat,
          Nguoi_De_Xuat: s.nguoi_de_xuat,
          Trang_Thai: s.trang_thai,
          Ghi_Chu: s.ghi_chu
        }));

        const oldPendingCount = (appData.requests || []).filter(r => r.Trang_Thai === 'Cho_Duyet').length;
        const newPendingCount = freshRequests.filter(r => r.Trang_Thai === 'Cho_Duyet').length;
        
        appData.requests = freshRequests;
        appData.specRequests = freshSpecs;
        
        updateNotificationDots();
        
        // Nếu có yêu cầu mới xuất hiện
        if (newPendingCount > oldPendingCount && oldPendingCount >= 0) {
          playNotificationBeep();
          showToast(`🔔 Có ${newPendingCount - oldPendingCount} yêu cầu xuất kho mới đang chờ duyệt!`, 'primary');
          const exportTab = document.getElementById('export-tab');
          if (exportTab && exportTab.classList.contains('active')) {
            renderAdminRequests();
          }
        }
      }
    } catch(e) {
      console.warn('Silent polling update error:', e);
    }
  }
}

// Phát âm báo chuông nhẹ bằng Web Audio API
function playNotificationBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch(e) {}
}

// ============================================================
// === 5. PHÂN HỆ TỦ HÓA CHẤT & VẬT TƯ DÙNG CHUNG (LAB SHARED CABINET) ===
// ============================================================

window.toggleSharedCabinetFields = function(prefix) {
  const chk = document.getElementById(`${prefix}-is-shared-cabinet`);
  const box = document.getElementById(`${prefix}-shared-cabinet-fields`);
  if (!box) return;
  box.style.display = (chk && chk.checked) ? 'block' : 'none';
};

window.addToSharedCabinet = function(itemObj) {
  if (!appData) return;
  if (!appData.sharedCabinet || !Array.isArray(appData.sharedCabinet)) {
    appData.sharedCabinet = [];
  }

  const roleNameMap = {
    'admin': 'Admin',
    'exporter': 'Người xuất kho',
    'importer': 'Người nhập kho',
    'staff': 'Nhân viên Lab',
    'student': 'Sinh viên'
  };
  const currentUser = roleNameMap[currentRole] || 'Nhân viên';

  const qty = parseFloat(itemObj.so_luong) || 1;
  const remainText = itemObj.khoi_luong_con_lai ? itemObj.khoi_luong_con_lai.toString().trim() : '';
  const isEmpty = qty <= 0 || remainText === '0' || remainText.toLowerCase() === '0g' || remainText.toLowerCase() === '0ml';

  const newItem = {
    id: 'SC_' + Date.now() + Math.floor(Math.random() * 1000),
    id_vat_tu: itemObj.id_vat_tu || '',
    ten: itemObj.ten || 'Hóa chất dùng chung',
    hang: itemObj.hang || '',
    quy_cach: itemObj.quy_cach || '',
    don_vi: itemObj.don_vi || 'Chai',
    vi_tri_tu: itemObj.vi_tri_tu || 'Tủ dùng chung A',
    so_luong: qty,
    khoi_luong_con_lai: remainText || (itemObj.quy_cach ? `${itemObj.quy_cach} (đã mở)` : 'Đang sử dụng'),
    tinh_trang: isEmpty ? 'empty' : 'active',
    ngay_tao: new Date().toISOString(),
    ngay_cap_nhat: new Date().toISOString(),
    nguoi_dua_vao: itemObj.nguoi_dua_vao || currentUser,
    nguoi_cap_nhat: itemObj.nguoi_dua_vao || currentUser,
    ghi_chu: itemObj.ghi_chu || ''
  };

  appData.sharedCabinet.unshift(newItem);
  saveSharedCabinet();

  const currentActiveTab = document.querySelector('.tab-content.active');
  if (currentActiveTab && currentActiveTab.id === 'shared-cabinet-tab') {
    renderSharedCabinet();
  }
};

window.saveSharedCabinet = async function() {
  if (!appData || !appData.sharedCabinet) return;
  localStorage.setItem('LAB_SHARED_CABINET_V1', JSON.stringify(appData.sharedCabinet));

  if (!supabaseClient) initSupabase();
  if (supabaseClient) {
    try {
      await supabaseClient.from('cau_hinh').upsert({
        key: 'shared_cabinet',
        value: JSON.stringify(appData.sharedCabinet),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
      console.log('Đã lưu Tủ Dùng Chung lên Supabase (cau_hinh: shared_cabinet)');
    } catch(err) {
      console.warn('Lưu Tủ Dùng Chung lên Supabase gặp lỗi, lưu trữ cục bộ an toàn:', err);
    }
  }
};

window.renderSharedCabinet = function() {
  const tbody = document.getElementById('shared-cabinet-tbody');
  if (!tbody) return;

  if (!appData || !appData.sharedCabinet || !Array.isArray(appData.sharedCabinet)) {
    const localSaved = localStorage.getItem('LAB_SHARED_CABINET_V1');
    if (localSaved) {
      try { appData.sharedCabinet = JSON.parse(localSaved); } catch(e) {}
    }
    if (!appData || !appData.sharedCabinet) {
      appData = appData || {};
      appData.sharedCabinet = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA.sharedCabinet || []));
    }
  }

  const allItems = appData.sharedCabinet || [];

  // Tính toán thống kê
  const totalCount = allItems.length;
  const activeCount = allItems.filter(i => (i.tinh_trang !== 'empty') && (parseFloat(i.so_luong) > 0)).length;
  const emptyCount = totalCount - activeCount;

  const statTotalEl = document.getElementById('sc-stat-total');
  const statActiveEl = document.getElementById('sc-stat-active');
  const statEmptyEl = document.getElementById('sc-stat-empty');
  if (statTotalEl) statTotalEl.innerText = totalCount;
  if (statActiveEl) statActiveEl.innerText = activeCount;
  if (statEmptyEl) statEmptyEl.innerText = emptyCount;

  // Cập nhật bộ lọc vị trí tủ
  const locSelect = document.getElementById('sc-location-filter') || document.getElementById('sc-filter-location');
  if (locSelect) {
    const currentLocVal = locSelect.value;
    const existingLocations = [...new Set([
      ...(appConfig.sharedLocations || []),
      ...allItems.map(i => i.vi_tri_tu).filter(Boolean)
    ])];
    
    locSelect.innerHTML = '<option value="">📍 Tất cả Vị trí Tủ dùng chung</option>';
    existingLocations.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc;
      opt.innerText = loc;
      locSelect.appendChild(opt);
    });
    locSelect.value = currentLocVal;
  }

  // Lấy giá trị lọc & tìm kiếm
  const searchInput = document.getElementById('sc-search-input');
  const query = searchInput ? removeVietnameseTones(searchInput.value.trim().toLowerCase()) : '';
  const filterLoc = locSelect ? locSelect.value.trim() : '';
  const filterStatusEl = document.getElementById('sc-status-filter') || document.getElementById('sc-filter-status');
  const filterStatus = filterStatusEl ? filterStatusEl.value : 'all';

  const filtered = allItems.filter(item => {
    // Lọc theo từ khóa
    if (query) {
      const matchText = removeVietnameseTones(`
        ${item.ten || ''} ${item.hang || ''} ${item.quy_cach || ''} 
        ${item.vi_tri_tu || ''} ${item.khoi_luong_con_lai || ''} 
        ${item.ghi_chu || ''} ${item.nguoi_dua_vao || ''} ${item.nguoi_cap_nhat || ''}
      `.toLowerCase());
      if (!matchText.includes(query)) return false;
    }

    // Lọc theo vị trí
    if (filterLoc && item.vi_tri_tu !== filterLoc) {
      return false;
    }

    // Lọc theo tình trạng
    const isItemActive = (item.tinh_trang !== 'empty') && (parseFloat(item.so_luong) > 0);
    if (filterStatus === 'active' && !isItemActive) return false;
    if (filterStatus === 'empty' && isItemActive) return false;

    return true;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🗄️</div>
          <div style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem;">Không tìm thấy hóa chất / vật tư nào trong Tủ Dùng Chung!</div>
          <div style="font-size: 0.85rem; margin-bottom: 1rem;">Bạn có thể bấm nút bên dưới để nhập nhanh các chai hóa chất có sẵn trong phòng lab.</div>
          <button class="btn btn-primary" onclick="openSharedCabinetAddModal()" style="font-size: 0.85rem;">
            ➕ Nhập Nhanh Hóa Chất Vào Tủ Dùng Chung
          </button>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const isItemActive = (item.tinh_trang !== 'empty') && (parseFloat(item.so_luong) > 0);
    const hasEmptyRequest = !!item.yeu_cau_bao_het;
    const isStudent = currentRole === 'student';
    const canManage = (currentRole === 'admin' || currentRole === 'importer' || currentRole === 'exporter' || currentRole === 'staff');

    const tr = document.createElement('tr');
    if (!isItemActive) {
      tr.style.opacity = '0.7';
      tr.style.background = 'rgba(0, 0, 0, 0.02)';
    } else if (hasEmptyRequest) {
      tr.style.background = 'rgba(254, 215, 170, 0.15)'; // Nổi bật dòng đang chờ duyệt báo hết
    }

    const updatedDateStr = item.ngay_cap_nhat ? new Date(item.ngay_cap_nhat).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Chưa có';

    // Cột trạng thái
    let statusBadgeHtml = '';
    if (hasEmptyRequest) {
      statusBadgeHtml = `<span class="badge" style="background: #ffedd5; color: #c2410c; border: 1.5px solid #f97316; font-size: 0.76rem; font-weight: 700; display: inline-block;">⏳ SV Báo Hết</span>`;
    } else if (isItemActive) {
      statusBadgeHtml = `<span class="badge badge-success" style="font-size: 0.8rem;">🟢 Đang dùng</span>`;
    } else {
      statusBadgeHtml = `<span class="badge badge-danger" style="font-size: 0.8rem;">⚪ Đã hết</span>`;
    }

    // Cột thao tác theo phân quyền
    let actionButtonsHtml = '';
    if (isStudent) {
      // Sinh viên: CHỈ ĐƯỢC XEM và CHỈ ĐƯỢC BẤM BÁO HẾT
      if (hasEmptyRequest) {
        actionButtonsHtml = `
          <span style="font-size: 0.78rem; color: #ea580c; font-weight: 600;">
            ⏳ Đã báo hết<br>(Chờ duyệt)
          </span>
        `;
      } else if (isItemActive) {
        actionButtonsHtml = `
          <button class="btn btn-warning" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 600;" onclick="requestSharedCabinetEmpty('${item.id}')" title="Báo chai đã hết để Người nhập kho duyệt">
            ⚪ Báo hết
          </button>
        `;
      } else {
        actionButtonsHtml = `<span style="font-size: 0.8rem; color: var(--text-muted);">Đã hết</span>`;
      }
    } else {
      // Người nhập kho / Admin / Cán bộ
      if (hasEmptyRequest) {
        // Cụm nút duyệt báo hết từ sinh viên: Người nhập kho ok -> xóa, không đồng ý -> giữ nguyên
        actionButtonsHtml = `
          <div style="display: flex; gap: 0.3rem; justify-content: flex-end; align-items: center;">
            <button class="btn btn-success" style="padding: 0.3rem 0.55rem; font-size: 0.76rem; font-weight: 700;" onclick="approveSharedCabinetEmpty('${item.id}', true)" title="Đồng ý chai đã hết -> Xóa khỏi tủ">
              ✅ Duyệt xóa
            </button>
            <button class="btn btn-secondary" style="padding: 0.3rem 0.55rem; font-size: 0.76rem;" onclick="approveSharedCabinetEmpty('${item.id}', false)" title="Không đồng ý -> Giữ nguyên trong tủ">
              ❌ Giữ lại
            </button>
          </div>
        `;
      } else {
        actionButtonsHtml = `
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="openSharedCabinetUpdateModal('${item.id}')" title="Cập nhật khối lượng còn lại / số chai">
              ✏️ Cập nhật
            </button>
            ${isItemActive ? `
              <button class="btn btn-warning" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="quickSetSharedCabinetEmpty('${item.id}')" title="Báo chai đã hết">
                ⚪ Báo hết
              </button>
            ` : ''}
            <button class="btn btn-danger" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;" onclick="deleteSharedCabinetItem('${item.id}')" title="Xóa hẳn khỏi tủ">
              🗑️
            </button>
          </div>
        `;
      }
    }

    const codeVal = item.ma_so || item.Ma_So || '';
    const codeHtml = codeVal 
      ? `<span class="item-code-chip">${escapeHtml(codeVal)}</span>` 
      : renderMissingData('', 'code');

    const formattedName = formatChemicalName(item.ten || '');
    const brandHtml = item.hang 
      ? `<span class="badge" style="background: var(--bg-hover);">${escapeHtml(item.hang)}</span>` 
      : renderMissingData('', 'brand');

    const specHtml = item.quy_cach ? escapeHtml(item.quy_cach) : renderMissingData('', 'spec');

    tr.innerHTML = `
      <td style="text-align: center;">${codeHtml}</td>
      <td style="font-weight: 600;">
        <div style="color: var(--primary); font-size: 0.95rem;">${escapeHtml(formattedName)}</div>
      </td>
      <td>${brandHtml}</td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${specHtml}</td>
      <td>
        <span class="badge" style="background: rgba(37, 99, 235, 0.12); color: #1d4ed8; font-weight: 600; font-size: 0.85rem; border: 1px solid rgba(37, 99, 235, 0.25);">
          🗄️ ${escapeHtml(item.vi_tri_tu || 'Chưa xếp')}
        </span>
      </td>
      <td style="text-align: center; font-weight: 700;">
        ${parseFloat(item.so_luong) > 0 ? `${item.so_luong} ${escapeHtml(item.don_vi || 'Chai')}` : '<span style="color: var(--danger); font-size: 0.8rem;">0 (Hết chai)</span>'}
      </td>
      <td>
        <span class="badge" style="font-size: 0.9rem; font-weight: 700; ${isItemActive ? 'background: rgba(22, 163, 74, 0.12); color: #15803d; border: 1px solid rgba(22, 163, 74, 0.3);' : 'background: rgba(220, 38, 38, 0.1); color: #dc2626;'}">
          ⚖️ ${escapeHtml(item.khoi_luong_con_lai || 'Chưa cập nhật')}
        </span>
      </td>
      <td style="text-align: center;">
        ${statusBadgeHtml}
      </td>
      <td style="font-size: 0.78rem;">
        <div>🕒 ${updatedDateStr}</div>
        <div style="color: var(--text-muted);">👤 ${escapeHtml(item.nguoi_cap_nhat || item.nguoi_dua_vao || 'Thành viên')}</div>
      </td>
      <td style="font-size: 0.82rem; max-width: 180px; color: var(--text-secondary);">
        ${item.ghi_chu ? escapeHtml(item.ghi_chu) : '<span style="color: var(--text-muted); font-style: italic;">-</span>'}
      </td>
      <td style="text-align: right; white-space: nowrap;">
        ${actionButtonsHtml}
      </td>
    `;

    tbody.appendChild(tr);
  });
};

window.handleSharedCabinetSearch = function() {
  renderSharedCabinet();
};

window.handleSharedCabinetLocationFilter = function() {
  renderSharedCabinet();
};

window.handleSharedCabinetStatusFilter = function() {
  renderSharedCabinet();
};

window.filterSharedCabinet = function() {
  renderSharedCabinet();
};

window.handleSharedEmptyToggle = function(isChecked) {
  const qtyInput = document.getElementById('sc-edit-qty');
  const remainInput = document.getElementById('sc-edit-remain');
  if (isChecked) {
    if (qtyInput) qtyInput.value = 0;
    if (remainInput) remainInput.value = '0 (Đã hết)';
  } else {
    if (qtyInput && parseFloat(qtyInput.value) === 0) qtyInput.value = 1;
    if (remainInput && remainInput.value.includes('Đã hết')) remainInput.value = '';
  }
};

// --- SINH VIÊN BÁO HẾT (CHUYỂN THÔNG TIN ĐẾN NGƯỜI NHẬP KHO DUYỆT) ---
window.requestSharedCabinetEmpty = function(id) {
  if (!appData || !appData.sharedCabinet) return;
  const item = appData.sharedCabinet.find(i => i.id === id);
  if (!item) return;

  const confirmMsg = `Xác nhận gửi thông tin báo hết chai [${item.ten}] đến Người nhập kho?\n\nNgười nhập kho sẽ kiểm tra thực tế và xác nhận duyệt để xóa khỏi Tủ Dùng Chung.`;
  if (!confirm(confirmMsg)) return;

  item.yeu_cau_bao_het = {
    nguoi_bao: 'Sinh viên',
    thoi_gian: new Date().toISOString()
  };

  saveSharedCabinet();
  renderSharedCabinet();
  showToast(`Đã gửi yêu cầu báo hết chai [${item.ten}] đến Người nhập kho xác nhận!`, 'info');
};

// --- NGƯỜI NHẬP KHO / ADMIN DUYỆT BÁO HẾT ---
window.approveSharedCabinetEmpty = function(id, isApproved) {
  if (!appData || !appData.sharedCabinet) return;
  const index = appData.sharedCabinet.findIndex(i => i.id === id);
  if (index === -1) return;

  const item = appData.sharedCabinet[index];

  if (isApproved) {
    // Người nhập kho đồng ý -> Xóa chai hóa chất đó khỏi Tủ Dùng Chung
    const confirmMsg = `XÁC NHẬN:\n\nĐồng ý chai [${item.ten}] đã hết thực tế và tiến hành XÓA KHỎI TỦ DÙNG CHUNG?`;
    appData.sharedCabinet.splice(index, 1);
    saveSharedCabinet();
    renderSharedCabinet();
    showToast(`Đã duyệt: Chai [${item.ten}] đã được xóa khỏi Tủ Dùng Chung!`, 'success');
  } else {
    // Không đồng ý -> Giữ nguyên hóa chất trong tủ
    delete item.yeu_cau_bao_het;
    item.ngay_cap_nhat = new Date().toISOString();
    item.nguoi_cap_nhat = currentRole === 'admin' ? 'Admin' : 'Người nhập kho';
    
    saveSharedCabinet();
    renderSharedCabinet();
    showToast(`Đã từ chối báo hết. Giữ nguyên chai [${item.ten}] trong Tủ Dùng Chung!`, 'primary');
  }
};

// Modal Thêm Nhanh vào Tủ Dùng Chung
window.openSharedCabinetAddModal = function() {
  if (currentRole === 'student') {
    alert('Sinh viên chỉ được xem và báo hết, không có quyền thêm mới vào Tủ Dùng Chung!');
    return;
  }
  const modal = document.getElementById('shared-cabinet-add-modal-overlay');
  if (!modal) return;
  const form = document.getElementById('shared-cabinet-add-form');
  if (form) form.reset();

  const codeInput = document.getElementById('sc-add-code');
  if (codeInput) codeInput.value = '';

  // Điền vị trí mặc định đầu tiên nếu có
  const locInput = document.getElementById('sc-add-location');
  if (locInput && appConfig.sharedLocations && appConfig.sharedLocations.length > 0) {
    locInput.value = appConfig.sharedLocations[0];
  }

  modal.classList.add('active');
};

window.closeSharedCabinetAddModal = function() {
  const modal = document.getElementById('shared-cabinet-add-modal-overlay');
  if (modal) modal.classList.remove('active');
};

window.handleSharedCabinetAddSubmit = function(e) {
  e.preventDefault();

  if (currentRole === 'student') {
    alert('Sinh viên không có quyền thêm mới vào Tủ Dùng Chung!');
    return;
  }

  const code = (document.getElementById('sc-add-code') ? document.getElementById('sc-add-code').value.trim() : '');
  const name = document.getElementById('sc-add-name').value.trim();
  const brand = document.getElementById('sc-add-brand').value.trim();
  const spec = document.getElementById('sc-add-spec').value.trim();
  const location = document.getElementById('sc-add-location').value.trim() || 'Tủ dùng chung A';
  const qty = parseFloat(document.getElementById('sc-add-qty').value) || 1;
  const unit = document.getElementById('sc-add-unit').value.trim() || 'Chai';
  const remain = document.getElementById('sc-add-remain').value.trim();
  const note = document.getElementById('sc-add-note').value.trim();

  if (!name) {
    showToast('Vui lòng nhập tên hóa chất / vật tư!', 'danger');
    return;
  }

  // Tự động lưu vị trí mới vào danh mục vị trí tủ dùng chung nếu chưa có
  if (location && appConfig.sharedLocations && !appConfig.sharedLocations.includes(location)) {
    appConfig.sharedLocations.push(location);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
    fillDatalist('list-shared-locations', appConfig.sharedLocations);
  }

  const roleNameMap = {
    'admin': 'Admin',
    'exporter': 'Người xuất kho',
    'importer': 'Người nhập kho',
    'staff': 'Nhân viên Lab',
    'student': 'Sinh viên'
  };

  addToSharedCabinet({
    ma_so: code,
    ten: name,
    hang: brand,
    quy_cach: spec,
    vi_tri_tu: location,
    so_luong: qty,
    don_vi: unit,
    khoi_luong_con_lai: remain || (spec ? `${spec} (đã mở)` : 'Đang sử dụng'),
    nguoi_dua_vao: roleNameMap[currentRole] || 'Người nhập kho',
    ghi_chu: note
  });

  closeSharedCabinetAddModal();
  showToast('Đã thêm nhanh hóa chất vào Tủ Dùng Chung thành công!', 'success');
  renderSharedCabinet();
};

// Modal Cập nhật thể tích / khối lượng còn lại
window.openSharedCabinetUpdateModal = function(id) {
  if (currentRole === 'student') {
    alert('Sinh viên không có quyền chỉnh sửa thông tin Tủ Dùng Chung!');
    return;
  }

  if (!appData || !appData.sharedCabinet) return;
  const item = appData.sharedCabinet.find(i => i.id === id);
  if (!item) {
    showToast('Không tìm thấy thông tin hóa chất!', 'danger');
    return;
  }

  document.getElementById('sc-edit-id').value = item.id;
  
  const nameEl = document.getElementById('sc-edit-item-name');
  const subEl = document.getElementById('sc-edit-item-sub');
  if (nameEl) {
    nameEl.innerHTML = `${item.ma_so ? `<span class="item-code-chip" style="margin-right: 6px;">${escapeHtml(item.ma_so)}</span>` : ''}<span>${escapeHtml(item.ten || '')}</span>`;
  }
  if (subEl) subEl.innerText = `${item.hang ? 'Hãng: ' + item.hang + ' | ' : ''}Quy cách ban đầu: ${item.quy_cach || 'Chưa rõ'}`;

  document.getElementById('sc-edit-location').value = item.vi_tri_tu || '';
  document.getElementById('sc-edit-remain').value = item.khoi_luong_con_lai || '';
  document.getElementById('sc-edit-qty').value = item.so_luong !== undefined ? item.so_luong : 1;
  document.getElementById('sc-edit-note').value = item.ghi_chu || '';

  const emptyChk = document.getElementById('sc-edit-is-empty');
  if (emptyChk) {
    emptyChk.checked = (item.tinh_trang === 'empty' || parseFloat(item.so_luong) <= 0);
  }

  const modal = document.getElementById('shared-cabinet-update-modal-overlay');
  if (modal) modal.classList.add('active');
};

window.closeSharedCabinetUpdateModal = function() {
  const modal = document.getElementById('shared-cabinet-update-modal-overlay');
  if (modal) modal.classList.remove('active');
};

window.handleSharedCabinetUpdateSubmit = function(e) {
  e.preventDefault();

  if (currentRole === 'student') {
    alert('Sinh viên không có quyền chỉnh sửa thông tin Tủ Dùng Chung!');
    return;
  }

  const id = document.getElementById('sc-edit-id').value;
  if (!appData || !appData.sharedCabinet) return;
  const item = appData.sharedCabinet.find(i => i.id === id);
  if (!item) {
    showToast('Mục không tồn tại!', 'danger');
    return;
  }

  const location = document.getElementById('sc-edit-location').value.trim() || item.vi_tri_tu;
  const remain = document.getElementById('sc-edit-remain').value.trim();
  const qty = parseFloat(document.getElementById('sc-edit-qty').value);
  const note = document.getElementById('sc-edit-note').value.trim();
  const isEmptyChk = document.getElementById('sc-edit-is-empty') && document.getElementById('sc-edit-is-empty').checked;

  // Tự động lưu vị trí tủ mới nếu chưa có
  if (location && appConfig.sharedLocations && !appConfig.sharedLocations.includes(location)) {
    appConfig.sharedLocations.push(location);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(appConfig));
    fillDatalist('list-shared-locations', appConfig.sharedLocations);
  }

  const roleNameMap = {
    'admin': 'Admin',
    'exporter': 'Người xuất kho',
    'importer': 'Người nhập kho',
    'staff': 'Nhân viên',
    'student': 'Sinh viên'
  };

  item.vi_tri_tu = location;
  item.khoi_luong_con_lai = remain;
  item.so_luong = isEmptyChk ? 0 : (isNaN(qty) ? 0 : qty);
  item.ghi_chu = note;
  item.ngay_cap_nhat = new Date().toISOString();
  item.nguoi_cap_nhat = roleNameMap[currentRole] || 'Nhân viên';

  const isEmpty = isEmptyChk || item.so_luong <= 0 || remain === '0' || remain.toLowerCase() === '0g' || remain.toLowerCase() === '0ml';
  item.tinh_trang = isEmpty ? 'empty' : 'active';
  if (isEmpty && (!remain || remain === '0')) {
    item.khoi_luong_con_lai = '0 (Đã hết)';
  }

  saveSharedCabinet();
  closeSharedCabinetUpdateModal();
  showToast('Đã cập nhật tình trạng Tủ Dùng Chung thành công!', 'success');
  renderSharedCabinet();
};

window.quickSetSharedCabinetEmpty = function(id) {
  if (!appData || !appData.sharedCabinet) return;
  const item = appData.sharedCabinet.find(i => i.id === id);
  if (!item) return;

  if (currentRole === 'student') {
    requestSharedCabinetEmpty(id);
    return;
  }

  if (!confirm(`Xác nhận đánh dấu chai [${item.ten}] trong tủ dùng chung đã được dùng hết?`)) {
    return;
  }

  const roleNameMap = {
    'admin': 'Admin',
    'exporter': 'Người xuất kho',
    'importer': 'Người nhập kho',
    'staff': 'Nhân viên',
    'student': 'Sinh viên'
  };

  item.so_luong = 0;
  item.khoi_luong_con_lai = '0 (Đã hết)';
  item.tinh_trang = 'empty';
  item.ngay_cap_nhat = new Date().toISOString();
  item.nguoi_cap_nhat = roleNameMap[currentRole] || 'Nhân viên';

  saveSharedCabinet();
  showToast(`Đã chuyển chai ${item.ten} sang trạng thái Đã hết!`, 'primary');
  renderSharedCabinet();
};

window.deleteSharedCabinetItem = function(id) {
  if (currentRole === 'student') {
    alert('Sinh viên không có quyền xóa hóa chất khỏi Tủ Dùng Chung!');
    return;
  }

  if (!appData || !appData.sharedCabinet) return;
  const index = appData.sharedCabinet.findIndex(i => i.id === id);
  if (index === -1) return;

  const item = appData.sharedCabinet[index];
  if (!confirm(`Bạn có chắc muốn xóa hẳn [${item.ten}] khỏi Tủ Dùng Chung?`)) {
    return;
  }

  appData.sharedCabinet.splice(index, 1);
  saveSharedCabinet();
  showToast('Đã xóa khỏi Tủ Dùng Chung!', 'primary');
  renderSharedCabinet();
};

window.downloadSharedCabinetExcelTemplate = function() {
  try {
    const headers = [
      ["Mã Số", "Tên Hóa Chất / Vật Tư", "Hãng Sản Xuất", "Quy Cách Ban Đầu", "Vị Trí Tủ Dùng Chung", "Số Lượng Chai", "Khối Lượng / Thể Tích Còn Lại", "Đơn Vị Tính", "Ghi Chú"]
    ];
    const sampleData = [
      ["HC-01", "Ethanol 96%", "VN", "500 ml", "Tủ dùng chung A", 1, "350 ml", "Chai", "Dùng cho thực hành vi sinh"],
      ["HC-02", "NaOH hạt tinh khiết", "Xilong", "500 g", "Tủ dùng chung B", 1, "200 g", "Chai", "Pha dung dịch kiểm tra"],
      ["HC-03", "Axit Clohidric HCl 37%", "Merck", "1000 ml", "Tủ hút", 1, "400 ml", "Chai", "Dùng cho đề tài QC"]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(headers.concat(sampleData));
    
    // Đặt độ rộng cột đẹp mắt
    ws['!cols'] = [
      { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 14 }, { wch: 26 }, { wch: 14 }, { wch: 32 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Tu_Dung_Chung");
    XLSX.writeFile(wb, "Bieu_Mau_Tu_Hoa_Chat_Dung_Chung.xlsx");
    showToast("Đã tải biểu mẫu Excel Tủ Dùng Chung thành công!", "success");
  } catch (err) {
    console.error(err);
    showToast("Không thể tải file mẫu Excel: " + err.message, "danger");
  }
};

window.triggerSharedCabinetExcelImport = function() {
  if (currentRole === 'student') {
    alert('Sinh viên không có quyền nạp Excel vào Tủ Dùng Chung!');
    return;
  }
  const input = document.getElementById('shared-cabinet-excel-file-input');
  if (input) input.click();
};

let sharedCabinetExcelPreviewItems = [];

window.handleSharedCabinetExcelFile = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawRows.length < 2) {
        showToast("File Excel trống hoặc không có dòng dữ liệu nào!", "warning");
        return;
      }

      const headerRow = rawRows[0].map(h => (h || '').toString().trim());

      // Helper tìm chỉ số cột theo từ khóa linh hoạt
      const findColIdx = (keywords) => {
        return headerRow.findIndex(h => {
          const cleanH = removeVietnameseTones(h.toLowerCase());
          return keywords.some(k => cleanH.includes(k));
        });
      };

      const codeIdx = findColIdx(['ma so', 'ma vat tu', 'ma', 'code']);
      const nameIdx = findColIdx(['ten', 'danh muc', 'vat tu', 'hoa chat']);
      const brandIdx = findColIdx(['hang', 'xuat xu', 'nsx']);
      const specIdx = findColIdx(['quy cach', 'dong goi']);
      const locIdx = findColIdx(['vi tri', 'tu', 'noi bao quan']);
      const qtyIdx = findColIdx(['so luong', 'so chai', 'sl']);
      const remainIdx = findColIdx(['khoi luong', 'the tich', 'con lai', 'thuc te']);
      const unitIdx = findColIdx(['don vi', 'dvt']);
      const noteIdx = findColIdx(['ghi chu', 'mo ta']);

      if (nameIdx === -1) {
        showToast("Không tìm thấy cột 'Tên Hóa Chất / Vật Tư' trong file Excel!", "danger");
        return;
      }

      sharedCabinetExcelPreviewItems = [];

      for (let r = 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!row || row.length === 0) continue;

        const ten = (row[nameIdx] || '').toString().trim();
        if (!ten) continue;

        const maSo = codeIdx !== -1 ? (row[codeIdx] || '').toString().trim() : '';
        const hang = brandIdx !== -1 ? (row[brandIdx] || '').toString().trim() : '';
        const quyCach = specIdx !== -1 ? (row[specIdx] || '').toString().trim() : '';
        const viTri = locIdx !== -1 ? (row[locIdx] || '').toString().trim() : 'Tủ dùng chung A';
        const sl = qtyIdx !== -1 ? (parseFloat(row[qtyIdx]) || 1) : 1;
        const remain = remainIdx !== -1 ? (row[remainIdx] || '').toString().trim() : '';
        const donVi = unitIdx !== -1 ? (row[unitIdx] || '').toString().trim() : 'Chai';
        const ghiChu = noteIdx !== -1 ? (row[noteIdx] || '').toString().trim() : '';

        sharedCabinetExcelPreviewItems.push({
          selected: true,
          ma_so: maSo,
          ten: ten,
          hang: hang,
          quy_cach: quyCach,
          vi_tri_tu: viTri || 'Tủ dùng chung A',
          so_luong: sl,
          khoi_luong_con_lai: remain || (quyCach ? `${quyCach} (đã mở)` : 'Đang sử dụng'),
          don_vi: donVi || 'Chai',
          ghi_chu: ghiChu
        });
      }

      if (sharedCabinetExcelPreviewItems.length === 0) {
        showToast("Không tìm thấy dòng hóa chất hợp lệ nào trong file!", "warning");
        return;
      }

      renderSharedCabinetExcelPreview();
      const modal = document.getElementById('shared-cabinet-excel-preview-modal-overlay');
      if (modal) modal.classList.add('active');

    } catch (err) {
      console.error(err);
      showToast("Lỗi khi đọc file Excel: " + err.message, "danger");
    } finally {
      e.target.value = ''; // Reset input để có thể chọn lại file
    }
  };

  reader.readAsArrayBuffer(file);
};

function renderSharedCabinetExcelPreview() {
  const tbody = document.getElementById('shared-cabinet-excel-preview-tbody');
  const summaryText = document.getElementById('sc-preview-summary-text');
  if (!tbody) return;

  tbody.innerHTML = '';
  let selectedCount = 0;

  sharedCabinetExcelPreviewItems.forEach((item, idx) => {
    if (item.selected) selectedCount++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center;">
        <input type="checkbox" ${item.selected ? 'checked' : ''} onchange="toggleSharedCabinetPreviewItem(${idx}, this.checked)" style="width: 16px; height: 16px; cursor: pointer;">
      </td>
      <td style="text-align: center;">
        ${item.ma_so ? `<span class="item-code-chip">${escapeHtml(item.ma_so)}</span>` : '<span class="missing-text">-</span>'}
      </td>
      <td style="font-weight: 600; color: var(--primary);">
        ${escapeHtml(item.ten)}
      </td>
      <td>${escapeHtml(item.hang || '-')}</td>
      <td>${escapeHtml(item.quy_cach || '-')}</td>
      <td>
        <input type="text" class="form-control" style="font-size: 0.8rem; padding: 0.25rem 0.5rem;" value="${escapeHtml(item.vi_tri_tu)}" list="list-shared-locations" onchange="updateSharedCabinetPreviewField(${idx}, 'vi_tri_tu', this.value)">
      </td>
      <td style="text-align: center;">
        <input type="number" class="form-control" style="font-size: 0.8rem; padding: 0.25rem 0.4rem; text-align: center;" value="${item.so_luong}" min="0" step="1" onchange="updateSharedCabinetPreviewField(${idx}, 'so_luong', parseFloat(this.value)||0)">
      </td>
      <td>
        <input type="text" class="form-control" style="font-size: 0.8rem; padding: 0.25rem 0.5rem;" value="${escapeHtml(item.khoi_luong_con_lai)}" onchange="updateSharedCabinetPreviewField(${idx}, 'khoi_luong_con_lai', this.value)">
      </td>
      <td>
        <input type="text" class="form-control" style="font-size: 0.8rem; padding: 0.25rem 0.5rem;" value="${escapeHtml(item.ghi_chu)}" onchange="updateSharedCabinetPreviewField(${idx}, 'ghi_chu', this.value)">
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (summaryText) {
    summaryText.innerText = `Đã chọn: ${selectedCount} / ${sharedCabinetExcelPreviewItems.length} mặt hàng hợp lệ`;
  }
}

window.toggleSharedCabinetPreviewItem = function(idx, checked) {
  if (sharedCabinetExcelPreviewItems[idx]) {
    sharedCabinetExcelPreviewItems[idx].selected = checked;
    const summaryText = document.getElementById('sc-preview-summary-text');
    const selectedCount = sharedCabinetExcelPreviewItems.filter(i => i.selected).length;
    if (summaryText) {
      summaryText.innerText = `Đã chọn: ${selectedCount} / ${sharedCabinetExcelPreviewItems.length} mặt hàng hợp lệ`;
    }
  }
};

window.updateSharedCabinetPreviewField = function(idx, field, val) {
  if (sharedCabinetExcelPreviewItems[idx]) {
    sharedCabinetExcelPreviewItems[idx][field] = val;
  }
};

window.toggleSelectAllSharedCabinetPreview = function(checked) {
  sharedCabinetExcelPreviewItems.forEach(item => item.selected = checked);
  renderSharedCabinetExcelPreview();
};

window.closeSharedCabinetExcelPreviewModal = function() {
  const modal = document.getElementById('shared-cabinet-excel-preview-modal-overlay');
  if (modal) modal.classList.remove('active');
};

window.confirmImportSharedCabinetExcel = function() {
  const selectedItems = sharedCabinetExcelPreviewItems.filter(i => i.selected);
  if (selectedItems.length === 0) {
    showToast("Vui lòng tích chọn ít nhất 1 mặt hàng để nhập!", "warning");
    return;
  }

  const roleNameMap = {
    'admin': 'Admin',
    'exporter': 'Người xuất kho',
    'importer': 'Người nhập kho',
    'staff': 'Nhân viên Lab',
    'student': 'Sinh viên'
  };
  const userName = roleNameMap[currentRole] || 'Người nhập kho';

  selectedItems.forEach(item => {
    addToSharedCabinet({
      ma_so: item.ma_so || '',
      ten: item.ten,
      hang: item.hang,
      quy_cach: item.quy_cach,
      vi_tri_tu: item.vi_tri_tu || 'Tủ dùng chung A',
      so_luong: item.so_luong,
      don_vi: item.don_vi || 'Chai',
      khoi_luong_con_lai: item.khoi_luong_con_lai || 'Đang sử dụng',
      nguoi_dua_vao: userName,
      ghi_chu: item.ghi_chu || 'Nhập từ file Excel'
    });
  });

  closeSharedCabinetExcelPreviewModal();
  showToast(`Đã duyệt & nhập thành công ${selectedItems.length} hóa chất vào Tủ Dùng Chung!`, 'success');
  renderSharedCabinet();
};

window.addEventListener('DOMContentLoaded', () => {
  syncAppVersionUI();
  init();
});