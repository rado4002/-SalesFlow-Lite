// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // --- ROLES ---
      roles: {
        ADMIN: "Administrator",
        USER: "Merchant"
      },

      // --- PAGE TITLES ---
      dashboard: "Dashboard",
      inventory: "Inventory",
      inventory_add: "Add Item",
      inventory_edit: "Edit Item",
      inventory_details: "Item Details",
      orders: "Orders",
      customers: "Customers",
      analytics: "Analytics",
      settings: "Settings",
      admin_diagnostics: "Diagnostics",

      // --- TOPBAR & MENU ---
      test_api: "Test API",
      test_me: "My Profile",
      logout: "Logout",

      // --- DASHBOARD ---
      welcome: "Welcome back, {{name}}!",
      dashboard_welcome: "You are successfully logged in.",
      today_revenue: "Today's Revenue",
      total_sales: "Total Sales",
      in_stock: "Items in Stock",
      pending_orders: "Pending Orders",
      add_product: "Add Product",
      new_sale: "New Sale",
      add_customer: "Add Customer",
      view_reports: "View Reports",
      quick_action: "Quick action",

      // --- DASHBOARD STATS (NEW!) ---
      stats_today_revenue: "Today’s Revenue",
      stats_total_sales: "Total Sales",
      stats_items_in_stock: "Items in Stock",
      stats_pending_orders: "Pending Orders",
      stats_currency: "USD",
      stats_no_data: "No data yet",

      // --- INVENTORY LIST ---
      items_total: "items in total",
      search_placeholder: "Search by name or SKU...",
      filter_all: "All Items",
      filter_low: "Low Stock",
      filter_out: "Out of Stock",
      out_of_stock: "Out of Stock",
      low_stock: "Low Stock",
      unit_price: "per unit",
      no_results: "No items match your search.",
      empty_inventory: "Your inventory is empty. Add your first item!",

      // --- INVENTORY FORM ---
      add_item_subtitle: "Fill in the details to add a new item to your inventory.",
      name: "Product Name",
      sku: "SKU",
      price: "Price",
      quantity: "Quantity in Stock",
      low_stock_threshold: "Low Stock Alert",
      saving: "Saving...",
      save_item: "Save Item",
      cancel: "Cancel",

      // --- FORM ERRORS & PLACEHOLDERS ---
      name_required: "Product name is required",
      sku_required: "SKU is required",
      price_min: "Price must be 0 or greater",
      quantity_min: "Quantity must be 0 or greater",
      threshold_min: "Low stock threshold must be 0 or greater",
      name_placeholder: "e.g. Coca Cola 330ml",
      sku_placeholder: "e.g. COC-330",

      // --- EDIT & DELETE ---
      edit: "Edit",
      delete: "Delete",
      confirm_delete: "Are you sure you want to delete this item? This action cannot be undone.",

      // --- ORDERS LIST ---
      orders_total: "orders in total",
      new_order: "New Order",
      search_orders: "Search by ID or customer...",
      order_status_pending: "Pending",
      order_status_completed: "Completed",
      order_status_cancelled: "Cancelled",
      no_orders_found: "No orders match your search.",
      no_orders_yet: "No orders yet. Create your first sale!",

      // --- ORDER CREATE ---
      create_order_subtitle: "Add items and create a new sale",
      customer_name: "Customer Name",
      customer_placeholder: "e.g. John Doe",
      add_items: "Add Items",
      search_inventory: "Search inventory...",
      order_items: "Order Items",
      cart_empty: "Cart is empty",
      total: "Total",
      creating: "Creating...",
      create_order: "Create Order",

      // --- ORDER DETAILS ---
      order_details: "Order Details",
      customer: "Customer",
      complete_order: "Complete Order",

      // --- LOGIN ---
      login: {
        subtitle: "Welcome back, please sign in",
        phone: "Phone Number",
        phone_placeholder: "Enter phone number",
        password: "Password",
        password_placeholder: "Enter password",
        sign_in: "Sign In",
        no_account: "Don't have an account?",
        register: "Register",
        error: "Login failed"
      },

      // --- REGISTER ---
      register: {
        title: "Create your account",
        subtitle: "Start tracking sales & inventory with SalesFlow Lite",
        name: "Full Name",
        email: "Email",
        phone: "Phone Number",
        password: "Password",
        confirm_password: "Confirm password",
        action: "Register",
        loading: "Creating...",
        back_to_login: "Back to Login",
        have_account: "Already have an account?",
        login_link: "Login",
        errors: {
          required: "Please fill all required fields",
          password_mismatch: "Passwords don't match",
          password_length: "Password must be at least 8 characters",
          generic: "Something went wrong. Please try again."
        }
      }
    }
  },

  // ---------------------------------- FR ----------------------------------
  fr: {
    translation: {
      roles: {
        ADMIN: "Administrateur",
        USER: "Marchand"
      },

      dashboard: "Tableau de bord",
      inventory: "Inventaire",
      inventory_add: "Ajouter un article",
      inventory_edit: "Modifier l'article",
      inventory_details: "Détails de l'article",
      orders: "Commandes",
      customers: "Clients",
      analytics: "Analytique",
      settings: "Paramètres",
      admin_diagnostics: "Diagnostics",

      test_api: "Tester l'API",
      test_me: "Mon Profil",
      logout: "Déconnexion",

      welcome: "Bienvenue, {{name}} !",
      dashboard_welcome: "Vous êtes connecté avec succès.",
      today_revenue: "Revenu d'aujourd'hui",
      total_sales: "Ventes totales",
      in_stock: "Articles en stock",
      pending_orders: "Commandes en attente",
      add_product: "Ajouter produit",
      new_sale: "Nouvelle vente",
      add_customer: "Ajouter client",
      view_reports: "Voir rapports",
      quick_action: "Action rapide",

      stats_today_revenue: "Revenu d’aujourd’hui",
      stats_total_sales: "Ventes totales",
      stats_items_in_stock: "Articles en stock",
      stats_pending_orders: "Commandes en attente",
      stats_currency: "USD",
      stats_no_data: "Aucune donnée",

      items_total: "articles au total",
      search_placeholder: "Rechercher par nom ou SKU...",
      filter_all: "Tous les articles",
      filter_low: "Stock faible",
      filter_out: "Rupture de stock",
      out_of_stock: "Rupture de stock",
      low_stock: "Stock faible",
      unit_price: "par unité",
      no_results: "Aucun article ne correspond à votre recherche.",
      empty_inventory: "Votre inventaire est vide. Ajoutez votre premier article !",

      add_item_subtitle: "Remplissez les détails pour ajouter un nouvel article.",
      name: "Nom du produit",
      sku: "SKU",
      price: "Prix",
      quantity: "Quantité en stock",
      low_stock_threshold: "Alerte stock faible",
      saving: "Enregistrement...",
      save_item: "Enregistrer",
      cancel: "Annuler",

      name_required: "Le nom du produit est requis",
      sku_required: "Le SKU est requis",
      price_min: "Le prix doit être supérieur ou égal à 0",
      quantity_min: "La quantité doit être supérieure ou égale à 0",
      threshold_min: "Le seuil de stock bas doit être supérieur ou égal à 0",
      name_placeholder: "ex. Coca Cola 330ml",
      sku_placeholder: "ex. COC-330",

      edit: "Modifier",
      delete: "Supprimer",
      confirm_delete: "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",

      orders_total: "commandes au total",
      new_order: "Nouvelle commande",
      search_orders: "Rechercher par ID ou client...",
      order_status_pending: "En attente",
      order_status_completed: "Terminée",
      order_status_cancelled: "Annulée",
      no_orders_found: "Aucune commande ne correspond à votre recherche.",
      no_orders_yet: "Aucune commande pour le moment. Créez votre première vente !",

      create_order_subtitle: "Ajoutez des articles et créez une nouvelle vente",
      customer_name: "Nom du client",
      customer_placeholder: "ex. Jean Dupont",
      add_items: "Ajouter des articles",
      search_inventory: "Rechercher dans l'inventaire...",
      order_items: "Articles de la commande",
      cart_empty: "Le panier est vide",
      total: "Total",
      creating: "Création...",
      create_order: "Créer la commande",

      order_details: "Détails de la commande",
      customer: "Client",
      complete_order: "Terminer la commande",

      login: {
        subtitle: "Bienvenue, veuillez vous connecter",
        phone: "Numéro de téléphone",
        phone_placeholder: "Entrez votre numéro",
        password: "Mot de passe",
        password_placeholder: "Entrez votre mot de passe",
        sign_in: "Connexion",
        no_account: "Pas de compte ?",
        register: "Créer un compte",
        error: "Échec de connexion"
      },

      register: {
        title: "Créer votre compte",
        subtitle: "Commencez à gérer les ventes et le stock avec SalesFlow Lite",
        name: "Nom complet",
        email: "Email",
        phone: "Numéro de téléphone",
        password: "Mot de passe",
        confirm_password: "Confirmer mot de passe",
        action: "S’inscrire",
        loading: "Création...",
        back_to_login: "Retour à la connexion",
        have_account: "Vous avez déjà un compte ?",
        login_link: "Connexion",
        errors: {
          required: "Veuillez remplir tous les champs requis",
          password_mismatch: "Les mots de passe ne correspondent pas",
          password_length: "Le mot de passe doit contenir au moins 8 caractères",
          generic: "Une erreur est survenue. Veuillez réessayer."
        }
      }
    }
  },

  // ---------------------------------- SW ----------------------------------
  sw: {
    translation: {
      roles: {
        ADMIN: "Msimamizi",
        USER: "Mfanyabiashara"
      },

      dashboard: "Dashibodi",
      inventory: "Hifadhi",
      inventory_add: "Ongeza bidhaa",
      inventory_edit: "Hariri bidhaa",
      inventory_details: "Maelezo ya bidhaa",
      orders: "Oda",
      customers: "Wateja",
      analytics: "Takwimu",
      settings: "Mipangilio",
      admin_diagnostics: "Utambuzi",

      test_api: "Jaribu API",
      test_me: "Wasifu Wangu",
      logout: "Kutoka",

      welcome: "Karibu tena, {{name}}!",
      dashboard_welcome: "Umefanikiwa kuingia.",
      today_revenue: "Mapato ya Leo",
      total_sales: "Jumla ya Mauzo",
      in_stock: "Bidhaa Zilizopo",
      pending_orders: "Oda Zisizosubiriwa",
      add_product: "Ongeza Bidhaa",
      new_sale: "Uza Mpya",
      add_customer: "Ongeza Mteja",
      view_reports: "Tazama Ripoti",
      quick_action: "Hatua ya Haraka",

      stats_today_revenue: "Mapato ya Leo",
      stats_total_sales: "Jumla ya Mauzo",
      stats_items_in_stock: "Bidhaa Zilizopo",
      stats_pending_orders: "Oda Zisizosubiriwa",
      stats_currency: "USD",
      stats_no_data: "Hakuna data",

      items_total: "bidhaa kwa jumla",
      search_placeholder: "Tafuta kwa jina au SKU...",
      filter_all: "Bidhaa Zote",
      filter_low: "Stock ya Chini",
      filter_out: "Hakuna Stock",
      out_of_stock: "Hakuna Stock",
      low_stock: "Stock ya Chini",
      unit_price: "kwa kila moja",
      no_results: "Hakuna bidhaa zinazolingana na utafutaji wako.",
      empty_inventory: "Hifadhi yako haina bidhaa. Ongeza bidhaa yako ya kwanza!",

      add_item_subtitle: "Jaza maelezo ili kuongeza bidhaa mpya.",
      name: "Jina la Bidhaa",
      sku: "SKU",
      price: "Bei",
      quantity: "Idadi katika Hifadhi",
      low_stock_threshold: "Tahadhari ya Stock ya Chini",
      saving: "Inahifadhi...",
      save_item: "Hifadhi Bidhaa",
      cancel: "Ghairi",

      name_required: "Jina la bidhaa linahitajika",
      sku_required: "SKU inahitajika",
      price_min: "Bei lazima iwe 0 au zaidi",
      quantity_min: "Idadi lazima iwe 0 au zaidi",
      threshold_min: "Kizingiti cha stock ya chini lazima kiwe 0 au zaidi",
      name_placeholder: "mfano: Coca Cola 330ml",
      sku_placeholder: "mfano: COC-330",

      edit: "Hariri",
      delete: "Futa",
      confirm_delete: "Una uhakika unataka kufuta bidhaa hii? Hatua hii haiwezi kutenduliwa.",

      orders_total: "oda kwa jumla",
      new_order: "Oda Mpya",
      search_orders: "Tafuta kwa ID au mteja...",
      order_status_pending: "Inasubiri",
      order_status_completed: "Imekamilika",
      order_status_cancelled: "Imeghairiwa",
      no_orders_found: "Hakuna oda zinazolingana na utafutaji wako.",
      no_orders_yet: "Hakuna oda bado. Unda mauzo yako ya kwanza!",

      create_order_subtitle: "Ongeza bidhaa na unda mauzo mapya",
      customer_name: "Jina la Mteja",
      customer_placeholder: "mfano: John Doe",
      add_items: "Ongeza Bidhaa",
      search_inventory: "Tafuta hifadhi...",
      order_items: "Bidhaa za Oda",
      cart_empty: "Gari la ununuzi liko tupu",
      total: "Jumla",
      creating: "Inaunda...",
      create_order: "Unda Oda",

      order_details: "Maelezo ya Oda",
      customer: "Mteja",
      complete_order: "Kamilisha Oda",

      login: {
        subtitle: "Karibu tena, tafadhali ingia",
        phone: "Namba ya simu",
        phone_placeholder: "Weka namba ya simu",
        password: "Nenosiri",
        password_placeholder: "Weka nenosiri",
        sign_in: "Ingia",
        no_account: "Huna akaunti?",
        register: "Jisajili",
        error: "Kuingia kumeshindikana"
      },

      register: {
        title: "Unda akaunti yako",
        subtitle: "Anza kufuatilia mauzo na hesabu kwa SalesFlow Lite",
        name: "Jina kamili",
        email: "Barua pepe",
        phone: "Namba ya simu",
        password: "Nenosiri",
        confirm_password: "Thibitisha nenosiri",
        action: "Jisajili",
        loading: "Inaundwa...",
        back_to_login: "Rudi kwenye kuingia",
        have_account: "Tayari una akaunti?",
        login_link: "Ingia",
        errors: {
          required: "Tafadhali jaza sehemu zote muhimu",
          password_mismatch: "Manenosiri hayalingani",
          password_length: "Nenosiri linapaswa kuwa na herufi angalau 8",
          generic: "Tatizo limetokea. Tafadhali jaribu tena."
        }
      }
    }
  },

  // ---------------------------------- LN ----------------------------------
  ln: {
    translation: {
      roles: {
        ADMIN: "Administratɛ́lɛ",
        USER: "Marchand"
      },

      dashboard: "Esika ya bokambi",
      inventory: "Biloko",
      inventory_add: "Bakisa eloko",
      inventory_edit: "Bobongola eloko",
      inventory_details: "Ba détails ya eloko",
      orders: "Ba commande",
      customers: "Ba Client",
      analytics: "Analyse",
      settings: "Paramètre",
      admin_diagnostics: "Diagnostics",

      test_api: "Kobeta API",
      test_me: "Profil Yanga",
      logout: "Kobima",

      welcome: "Boyeyi malamu, {{name}}!",
      dashboard_welcome: "Ozali na système kala.",
      today_revenue: "Mapato ya lelo",
      total_sales: "Total ya ventes",
      in_stock: "Biloko bizali",
      pending_orders: "Commande ezali na attente",
      add_product: "Bakisa eloko",
      new_sale: "Vente ya sika",
      add_customer: "Bakisa client",
      view_reports: "Tala rapports",
      quick_action: "Action ya haraka",

      stats_today_revenue: "Mapato ya lelo",
      stats_total_sales: "Total ya ventes",
      stats_items_in_stock: "Biloko bizali",
      stats_pending_orders: "Commande na attente",
      stats_currency: "USD",
      stats_no_data: "Pas de données",

      items_total: "biloko nyonso",
      search_placeholder: "Luka na nkombo to SKU...",
      filter_all: "Biloko nyonso",
      filter_low: "Stock ya basali",
      filter_out: "Pas de stock",
      out_of_stock: "Pas de stock",
      low_stock: "Stock ya basali",
      unit_price: "par eloko",
      no_results: "Eloko moko te ezali na recherche na yo.",
      empty_inventory: "Stock na yo ezali vide. Bakisa eloko ya liboso!",

      add_item_subtitle: "Futá ba détails mpo na kobakisa eloko ya sika.",
      name: "Nkombo ya eloko",
      sku: "SKU",
      price: "Prix",
      quantity: "Quantité na stock",
      low_stock_threshold: "Alerte ya stock ya basali",
      saving: "Ezosala...",
      save_item: "Hifadhi eloko",
      cancel: "Koboma",

      name_required: "Nkombo ya eloko ezali na condition",
      sku_required: "SKU ezali na condition",
      price_min: "Prix esengeli kozala 0 to koleka",
      quantity_min: "Quantité esengeli kozala 0 to koleka",
      threshold_min: "Seuil ya stock ya basali esengeli kozala 0 to koleka",
      name_placeholder: "mfano: Coca Cola 330ml",
      sku_placeholder: "mfano: COC-330",

      edit: "Bobongola",
      delete: "Koboma",
      confirm_delete: "Ozali na ntembe te ya koboma eloko oyo ? Action oyo ekoki te kozongisa.",

      orders_total: "commande nyonso",
      new_order: "Commande ya sika",
      search_orders: "Luka na ID to client...",
      order_status_pending: "Na attente",
      order_status_completed: "Ekomplété",
      order_status_cancelled: "Eghairi",
      no_orders_found: "Commande moko te na recherche na yo.",
      no_orders_yet: "Commande moko te biso. Sala vente ya liboso!",

      create_order_subtitle: "Bakisa biloko mpe sala vente ya sika",
      customer_name: "Nkombo ya client",
      customer_placeholder: "mfano: John Doe",
      add_items: "Bakisa biloko",
      search_inventory: "Luka na stock...",
      order_items: "Biloko ya commande",
      cart_empty: "Panier ezali vide",
      total: "Total",
      creating: "Ezosala...",
      create_order: "Sala commande",

      order_details: "Détails ya commande",
      customer: "Client",
      complete_order: "Kamilisha commande",

      login: {
        subtitle: "Boyeyi malamu, kota na système",
        phone: "Nimero ya telefone",
        phone_placeholder: "Koma nimero",
        password: "Mot de passe",
        password_placeholder: "Koma mot de passe",
        sign_in: "Kota",
        no_account: "Ozali naino na compte te?",
        register: "Koma membre",
        error: "Kokota elongi te"
      },

      register: {
        title: "Kokela compte na yo",
        subtitle: "Bandá kolandela ventes na stock",
        name: "Nkombo mobimba",
        email: "Email",
        phone: "Nimero ya telefone",
        password: "Mot de passe",
        confirm_password: "Bondimisana mot de passe",
        action: "Kosala compte",
        loading: "Ezosala...",
        back_to_login: "Zonga na entrée",
        have_account: "Ozali déjà na compte ?",
        login_link: "Kokɔta",
        errors: {
          required: "Futá bilanga nyonso ya ebele",
          password_mismatch: "Mot de passe ezalaki ko correspondre te",
          password_length: "Mot de passe esengeli kozala na ba lettres 8 to koleka",
          generic: "Esalami erreur. Meyá lisusu."
        }
      }
    }
  },

  // ---------------------------------- ZH ----------------------------------
  zh: {
    translation: {
      roles: {
        ADMIN: "管理员",
        USER: "商家"
      },

      dashboard: "仪表板",
      inventory: "库存",
      inventory_add: "添加物品",
      inventory_edit: "编辑物品",
      inventory_details: "物品详情",
      orders: "订单",
      customers: "客户",
      analytics: "分析",
      settings: "设置",
      admin_diagnostics: "诊断",

      test_api: "测试 API",
      test_me: "我的资料",
      logout: "退出登录",

      welcome: "欢迎回来，{{name}}！",
      dashboard_welcome: "您已成功登录。",
      today_revenue: "今日收入",
      total_sales: "总销售额",
      in_stock: "库存商品",
      pending_orders: "待处理订单",
      add_product: "添加商品",
      new_sale: "新销售",
      add_customer: "添加客户",
      view_reports: "查看报告",
      quick_action: "快速操作",

      stats_today_revenue: "今日收入",
      stats_total_sales: "总销售额",
      stats_items_in_stock: "库存商品",
      stats_pending_orders: "待处理订单",
      stats_currency: "USD",
      stats_no_data: "暂无数据",

      items_total: "总计物品",
      search_placeholder: "按名称或 SKU 搜索...",
      filter_all: "所有物品",
      filter_low: "低库存",
      filter_out: "缺货",
      out_of_stock: "缺货",
      low_stock: "低库存",
      unit_price: "单价",
      no_results: "没有匹配的物品。",
      empty_inventory: "您的库存为空。添加您的第一件商品！",

      add_item_subtitle: "填写详细信息以添加新物品。",
      name: "商品名称",
      sku: "SKU",
      price: "价格",
      quantity: "库存数量",
      low_stock_threshold: "低库存警报",
      saving: "保存中...",
      save_item: "保存商品",
      cancel: "取消",

      name_required: "商品名称是必填项",
      sku_required: "SKU 是必填项",
      price_min: "价格必须大于或等于 0",
      quantity_min: "数量必须大于或等于 0",
      threshold_min: "低库存阈值必须大于或等于 0",
      name_placeholder: "例如：可口可乐 330ml",
      sku_placeholder: "例如：COC-330",

      edit: "编辑",
      delete: "删除",
      confirm_delete: "您确定要删除此商品吗？此操作无法撤销。",

      orders_total: "总计订单",
      new_order: "新订单",
      search_orders: "按 ID 或客户搜索...",
      order_status_pending: "待处理",
      order_status_completed: "已完成",
      order_status_cancelled: "已取消",
      no_orders_found: "没有匹配的订单。",
      no_orders_yet: "暂无订单。创建您的第一笔销售！",

      create_order_subtitle: "添加商品并创建新销售",
      customer_name: "客户姓名",
      customer_placeholder: "例如：张三",
      add_items: "添加商品",
      search_inventory: "搜索库存...",
      order_items: "订单商品",
      cart_empty: "购物车为空",
      total: "总计",
      creating: "创建中...",
      create_order: "创建订单",

      order_details: "订单详情",
      customer: "客户",
      complete_order: "完成订单",

      login: {
        subtitle: "欢迎回来，请登录",
        phone: "手机号",
        phone_placeholder: "输入手机号",
        password: "密码",
        password_placeholder: "输入密码",
        sign_in: "登录",
        no_account: "没有账户？",
        register: "注册",
        error: "登录失败"
      },

      register: {
        title: "创建您的账户",
        subtitle: "使用 SalesFlow Lite 管理销售与库存",
        name: "姓名",
        email: "电子邮箱",
        phone: "电话号码",
        password: "密码",
        confirm_password: "确认密码",
        action: "注册",
        loading: "创建中...",
        back_to_login: "返回登录",
        have_account: "已经有账户？",
        login_link: "登录",
        errors: {
          required: "请填写所有必填字段",
          password_mismatch: "两次密码不一致",
          password_length: "密码至少需要 8 个字符",
          generic: "发生错误，请重试。"
        }
      }
    }
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;