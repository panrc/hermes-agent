/**
 * 简体中文 DOM 覆盖层（本地中文补丁，由 ~/.hermes/scripts/patch_zh_i18n.py 生成/维护）
 *
 * 为什么存在：dashboard 前端仍有一批**写死没走 i18n 的英文**（System / Cron / Profiles /
 * Plugins 等页面的 JSX 字面量），逐处改组件风险大、且 hermes update 会覆盖源码树。
 * 这里在渲染后按「精确文本 / 正则规则」把可见英文替换成中文：
 *   - 只翻字典里有的串，任务标题、profile 名、路径、数字等用户数据原样透传；
 *   - 字典键统一按小写比较（页面标签常用 CSS `uppercase`，DOM 里是 Title Case）；
 *   - 仅在中文 locale 下生效（localStorage['hermes-locale'] 或 <html lang>），切英文时原样；
 *   - MutationObserver 跟踪 React 重渲染，新节点也会被翻。
 * 关掉它：删掉 main.tsx 里的 startZhDomOverlay() 调用（或 patch 脚本回滚后重跑）。
 */

const ZH_TEXT: Record<string, string> = {
  // ── 页面 / 区块标题 ──
  system: "系统",
  host: "主机",
  os: "操作系统",
  arch: "架构",
  memory: "内存",
  disk: "磁盘",
  uptime: "运行时长",
  "load avg": "平均负载",
  cpu: "CPU",
  "10 cores": "10 核",
  cores: "核",
  // ── 更新 ──
  "update available": "有可用更新",
  "check for updates": "检查更新",
  "update now": "立即更新",
  // ── 订阅 / 门户 ──
  "nous portal": "Nous 门户",
  "not logged in": "未登录",
  "manage subscription": "管理订阅",
  "log in with": "用",
  "hermes portal": "Hermes 门户",
  "inference provider:": "推理提供方：",
  // ── 工具网关路由 ──
  "tool gateway routing": "工具网关路由",
  "web tools": "网页工具",
  "image generation": "图像生成",
  "video generation": "视频生成",
  "speech-to-text": "语音转文字",
  "browser automation": "浏览器自动化",
  "local browser": "本地浏览器",
  "modal execution": "Modal 执行",
  "not configured": "未配置",
  local: "本地",
  // ── 技能管理器 ──
  "skill curator": "技能管理器",
  active: "启用中",
  inactive: "未启用",
  pause: "暂停",
  "run now": "立即运行",
  // ── 网关 ──
  gateway: "网关",
  running: "运行中",
  "running — messaging channels are online": "运行中 —— 消息渠道在线",
  start: "启动",
  restart: "重启",
  stop: "停止",
  // ── 记忆 ──
  "external provider:": "外部提供方：",
  "built-in only": "仅内置",
  "change in plugins →": "在「插件」里更改 →",
  "provider setup:": "提供方设置：",
  "configure in plugins": "在「插件」里配置",
  "reset all": "全部重置",
  // ── 凭据池 ──
  "credential pool": "凭据池",
  provider: "提供方",
  "api key": "API 密钥",
  label: "标签",
  "add key": "添加密钥",
  // ── 运维 ──
  operations: "运维",
  "open console": "打开控制台",
  "run doctor": "运行诊断",
  "security audit": "安全审计",
  "update skills": "更新技能",
  "prompt size": "提示词大小",
  "support dump": "支持信息转储",
  "migrate config": "迁移配置",
  // ── 备份 ──
  "full backup": "完整备份",
  "create backup": "创建备份",
  "download backup": "下载备份",
  "no backup created yet": "尚未创建备份",
  "restore from backup upload": "从上传的备份恢复",
  "choose restore zip": "选择恢复用的 zip",
  "no backup archive selected": "未选择备份压缩包",
  "restore upload": "上传并恢复",
  "restore from backups path": "从备份路径恢复",
  "restore path": "备份路径",
  "share debug report": "分享调试报告",
  "generate share link": "生成分享链接",
  "redact credential-shaped tokens before upload (recommended)": "上传前隐去形似凭据的令牌（推荐）",
  "uploads system info + logs to a public paste service and returns links to send the hermes team. pastes auto-delete after 6 hours.":
    "把系统信息与日志上传到公共粘贴服务，返回可发给 Hermes 团队的链接。粘贴内容 6 小时后自动删除。",
  // ── 检查点 / 钩子 ──
  checkpoints: "检查点",
  prune: "清理",
  "shell hooks": "Shell 钩子",
  "repeat:": "重复：",
  forever: "永久",
  "delivery:": "投递：",
  delivery_failed: "投递失败",
  "weekdays at": "工作日",
  "new hook": "新建钩子",
  "no shell hooks configured.": "尚未配置 Shell 钩子。",
  "session(s) ·": "个会话 ·",
  // ── 定时任务页 ──
  jobs: "任务列表",
  blueprints: "蓝图",
  profile: "配置",
  "all profiles": "全部配置",
  "all tenants": "全部租户",
  scheduled: "已调度",
  paused: "已暂停",
  error: "出错",
  disabled: "已停用",
  completed: "已完成",
  failed: "失败",
  interrupted: "已中断",
  "timed out": "已超时",
  // ── 配置页 ──
  build: "构建",
  // ── 插件页 chrome ──
  "configure memory providers and runtime context engine selection.":
    "配置记忆提供方与运行时上下文引擎。",
  "hermes will use the built-in memory.md and user.md files.":
    "Hermes 将使用内置的 MEMORY.md 与 USER.md 文件。",
  "save memory provider": "保存记忆提供方",
  "save context engine": "保存上下文引擎",
  none: "无",
  settings: "设置",
  save: "保存",
  cancel: "取消",
  delete: "删除",
  refresh: "刷新",
  close: "关闭",
  open: "打开",
  search: "搜索",
  loading: "加载中",
  // ── 各页面按钮/对话框的英文 tooltip 与标题（grep title=" 得到） ──
  "authenticate with oauth": "用 OAuth 认证",
  "cancel rename": "取消重命名",
  "collapse side panel": "收起侧栏",
  copy: "复制",
  "delete webhook": "删除 WEBHOOK",
  "edit skill.md": "编辑 SKILL.md",
  "edit job": "编辑任务",
  "expensive model warning": "昂贵模型提醒",
  "export session json": "导出会话 JSON",
  "import exported session json or jsonl": "导入导出的会话 JSON 或 JSONL",
  "log out": "退出登录",
  "prune checkpoints": "清理检查点",
  remove: "移除",
  "remove mcp server": "移除 MCP 服务器",
  "remove credential": "移除凭据",
  "remove shell hook": "移除 Shell 钩子",
  "rename session": "重命名会话",
  "replace the saved whatsapp link?": "替换已保存的 WhatsApp 链接？",
  "reset auxiliary models": "重置辅助模型",
  "reset memory": "重置记忆",
  "restart the shared gateway?": "重启共享网关？",
  "restore full hermes backup?": "恢复完整 Hermes 备份？",
  revoke: "撤销",
  "revoke access": "撤销访问",
  "save title": "保存标题",
  "select moa model": "选择 MoA 模型",
  "set main model": "设为主模型",
  "show side panel (model + sessions)": "显示侧栏（模型 + 会话）",
  "switch model?": "切换模型？",
  "test connection": "测试连接",
  "update hermes?": "更新 Hermes？",
  optional: "可选",
  "owner/repo, owner/repo/subdir, or https://...": "owner/repo、owner/repo/subdir 或 https://…",
  // ── 模型页 / 会话页 ──
  "model settings": "模型设置",
  "applies to new sessions": "仅对新会话生效",
  "main model": "主模型",
  change: "更改",
  "auxiliary tasks": "辅助任务",
  configure: "配置",
  "mixture of agents": "多模型混合（MoA）",
  "use as": "用作",
  main: "主模型",
  "prune old sessions": "清理旧会话",
  total: "总计",
  "active in store": "库中活跃",
  archived: "已归档",
  messages: "消息数",
  sources: "来源",
  "any chat source": "任何聊天来源",
  "import sessions": "导入会话",
  // ── 文件 / 日志页 ──
  files: "文件",
  actions: "操作",
  path: "路径",
  "drop files here": "把文件拖到这里",
  "choose files": "选择文件",
  upload: "上传",
  create: "新建",
  name: "名称",
  size: "大小",
  modified: "修改时间",
  folder: "文件夹",
  "new folder": "新建文件夹",
  rename: "重命名",
  download: "下载",
  follow: "跟随",
  clear: "清空",
  "log level": "日志级别",
  all: "全部",
  errors: "错误",
  debug: "调试",
  warning: "警告",
  info: "信息",
  "token & cost analytics are hidden because the local counts exclude auxiliary calls (compression, vision, web extract, …) and provider retries, so they diverge from your provider bill. enable dashboard.show_token_analytics in config to show the local debug estimate anyway.":
    "令牌与费用统计已隐藏：本地统计不含辅助调用（压缩、视觉、网页抓取等）和提供方重试，与你的账单对不上。想显示本地调试估值，请在配置里打开 dashboard.show_token_analytics。",

  // ══════════════════════════════════════════════════════════════════════
  // MCP 页（/mcp）
  // ══════════════════════════════════════════════════════════════════════
  "mcp": "MCP",
  "add server": "添加服务器",
  "add mcp server": "添加 MCP 服务器",
  "disable": "禁用",
  "enable": "启用",
  "this will remove the server.": "这会移除该服务器。",
  "args": "参数",
  "command": "命令",
  "transport": "传输方式",
  "authentication": "认证",
  "bearer token": "Bearer 令牌",
  "token or bearer token": "Bearer 令牌或 Token",
  "authenticate": "认证",
  "added — authenticate with oauth": "已添加 —— 请用 OAuth 认证",
  "install": "安装",
  "installing...": "安装中…",
  "installing…": "安装中…",
  "installing in background…": "后台安装中…",
  "adding...": "添加中…",
  "add ✓": "已添加 ✓",
  "browse nous-approved mcp servers and install them with one click.": "浏览 Nous 审核过的 MCP 服务器，一键安装。",
  "browse catalog": "浏览目录",
  "setup notes": "配置说明",
  "source ↗": "来源 ↗",
  "install from:": "安装来源：",
  "installs from:": "安装来源：",
  "runs:": "运行命令：",
  "endpoint:": "端点：",
  "this mcp requires the following values to be configured.": "这个 MCP 需要先填写以下配置值。",
  "stored in this profile's .env; config.yaml keeps only an environment-variable reference.":
    "存在本配置档的 .env 里；config.yaml 只保留环境变量引用。",
  "connected — no tools": "已连接 —— 无工具",
  "connection failed": "连接失败",
  "invalid mcp server": "MCP 服务器无效",
  "enable/disable takes effect on the next gateway restart.": "启用/禁用在下次重启网关后生效。",
  "no mcp servers yet. mcp servers give the agent extra tools (github, databases, browsers…). pick one from the catalog below, or click add server at the top of the page.":
    "还没有 MCP 服务器。MCP 服务器给智能体加装工具（GitHub、数据库、浏览器…）。可以从下面的目录里挑一个，或点页面顶部的「添加服务器」。",
  "no catalog entries available.": "目录里暂时没有条目。",
  "loading...": "加载中…",
  "loading…": "加载中…",

  // ══════════════════════════════════════════════════════════════════════
  // 渠道页（/channels）—— 平台卡片文案来自后端 manifest（dashboard_description）
  // ══════════════════════════════════════════════════════════════════════
  "channels": "渠道",
  "via": "通过",
  "restart gateway": "重启网关",
  "connected": "已连接",
  "disconnected": "未连接",
  "enabled": "已启用",
  "test": "测试",
  "connect": "连接",
  "disconnect": "断开连接",
  "reconnect": "重新连接",
  "quick setup": "快速设置",
  "manual setup": "手动设置",
  "recommended": "推荐",
  "create with qr": "扫码创建",
  "use your own bot": "用自建机器人",
  "pair with qr": "扫码配对",
  "re-pair with qr": "重新扫码配对",
  "mode": "模式",
  "self-chat": "自聊",
  "allowed whatsapp numbers": "允许的 WhatsApp 号码",
  "allowed users": "允许的用户",
  "bot": "机器人",
  "message": "消息",
  "linked": "已关联",
  "ready": "就绪",
  "waiting": "等待中",
  "owner detected": "已识别号主",
  "add": "添加",
  "open telegram": "打开 Telegram",
  "open @botfather": "打开 @BotFather",
  "open chat link": "打开聊天链接",
  "find my user id": "查找我的用户 ID",
  "telegram user id": "Telegram 用户 ID",
  "save and restart": "保存并重启",
  "save and restart the gateway.": "保存并重启网关。",
  "save & enable": "保存并启用",
  "saving…": "保存中…",
  "starting…": "启动中…",
  "restarting…": "重启中…",
  "restart now": "立即重启",
  "restart to apply": "重启以生效",
  "gateway stopped": "网关已停止",
  "start failed": "启动失败",
  "gateway restarting…": "网关正在重启…",
  "botfather guide": "BotFather 指南",
  "setup guide": "设置指南",
  "nothing to save — fill in at least one field.": "没有可保存的内容 —— 至少填一项。",
  "fix the highlighted fields before saving.": "保存前先修正标红字段。",
  "copy the complete bot token botfather gives you.": "复制 BotFather 给你的完整机器人 token。",
  "finish or cancel the current qr setup before switching methods.": "切换方式前，请先完成或取消当前的扫码设置。",
  "changes are saved. restart the gateway for them to take effect.": "已保存。重启网关后生效。",
  "the gateway is not running. configure channels here, then start the gateway with":
    "网关没有在运行。先在这里配置渠道，然后用这条命令启动网关：",
  "add at least one telegram user id.": "至少添加一个 Telegram 用户 ID。",
  "add at least one allowed telegram user id.": "至少添加一个允许的 Telegram 用户 ID。",
  "paste the complete token from @botfather (for example, 123456789:abc…).":
    "粘贴 @BotFather 给出的完整 token（例如 123456789:ABC…）。",
  "telegram pairing expired. start a new qr setup to try again.":
    "Telegram 配对已过期。重新发起一次扫码设置即可再试。",
  "telegram setup qr code": "Telegram 设置二维码",
  "whatsapp qr setup expired. start a new qr setup to try again.":
    "WhatsApp 扫码设置已过期。重新发起一次扫码即可再试。",
  "whatsapp device linked": "WhatsApp 设备已关联",
  "this is the whatsapp account hermes is now logged into.": "这是 Hermes 现在登录的 WhatsApp 账号。",
  "use this if whatsapp logged out or removed this linked device. disable whatsapp and restart the gateway first. the old session will be kept in a private backup. scan the new qr from linked devices on your phone, then save and restart to enable whatsapp again.":
    "如果 WhatsApp 退出了登录或解除了这台已关联设备，就用这个。请先停用 WhatsApp 并重启网关；旧会话会保留在一份私有备份里。在手机「已关联的设备」里扫新的二维码，然后保存并重启即可重新启用 WhatsApp。",
  "use your own telegram bot": "用你自己的 Telegram 机器人",
  "requires the buzz cli binary (https://github.com/block/buzz) on path or at buzz_cli_path":
    "需要 buzz CLI 程序（https://github.com/block/buzz），放在 PATH 里或用 BUZZ_CLI_PATH 指定",
  "requires the buzz cli binary and a nostr key that is a community member.":
    "需要 buzz CLI 程序，以及一把属于社区成员的 Nostr 密钥。",
  "allowed telegram user ids must be numeric.": "Telegram 允许用户 ID 必须是数字。",
  "telegram allowed users must be comma-separated numeric user ids.":
    "Telegram 允许用户必须是用逗号分隔的数字用户 ID。",
  "telegram bot token must be the complete token from @botfather, such as 123456789:abc…":
    "Telegram 机器人 token 必须是 @BotFather 给的完整 token，例如 123456789:ABC…",
  "after saving, unknown dms use hermes pairing codes unless their number is already allowed.":
    "保存后，陌生私聊会走 Hermes 配对码，除非号码已在允许列表里。",
  "you can leave allowed users blank. hermes will then send new dm users a code that you approve from the pairing page.":
    "允许用户可以留空。那样 Hermes 会给陌生私聊用户发配对码，你在「配对」页批准即可。",
  "existing whatsapp settings are configured.": "已有 WhatsApp 配置。",
  "existing whatsapp session found": "发现已有 WhatsApp 会话",
  "scan with whatsapp linked devices, not the camera app.": "用 WhatsApp 的「已关联的设备」扫码，不要用相机。",
  "waiting for whatsapp to provide a qr code…": "正在等待 WhatsApp 生成二维码…",
  "whatsapp setup qr code": "WhatsApp 设置二维码",
  "whatsapp setup failed.": "WhatsApp 设置失败。",
  "whatsapp saved; gateway restarting…": "WhatsApp 已保存；网关正在重启…",
  "whatsapp is linked but hermes is not listening yet. save and restart the gateway to finish setup.":
    "WhatsApp 已关联，但 Hermes 还没开始监听。保存并重启网关即可完成设置。",
  "telegram saved; gateway restarting…": "Telegram 已保存；网关正在重启…",
  "back up and re-pair": "备份并重新配对",
  "hermes is logged into the whatsapp account that scanned the qr code.":
    "Hermes 已登录到扫码的那个 WhatsApp 账号。",
  "hermes will keep the saved whatsapp allowlist.": "Hermes 会保留已保存的 WhatsApp 允许列表。",
  "if no allowed numbers were entered, hermes replies with a pairing code. approve it from the dashboard pairing page.":
    "如果没填允许号码，Hermes 会回复一个配对码，去控制台「配对」页批准。",
  "self-chat mode will allow the linked account automatically when you save.":
    "自聊模式下保存时会自动允许该关联账号。",
  "after the restart, open message yourself on the linked account and send hermes a message.":
    "重启后，在关联账号里打开「给自己发消息」并给 Hermes 发一条消息。",
  "after the restart, start a chat from another whatsapp account with the linked account and send hermes a message.":
    "重启后，用另一个 WhatsApp 账号和关联账号发起聊天并给 Hermes 发消息。",
  "open whatsapp on your phone, then go to linked devices and scan from there. this qr is not a browser url.":
    "在手机上打开 WhatsApp，进入「已关联的设备」再扫码。这个二维码不是网页链接。",
  "preparing the whatsapp bridge. the qr code will appear here when it is ready.":
    "正在准备 WhatsApp 桥，二维码就绪后会出现在这里。",
  "starting the whatsapp pairing bridge. the qr code will appear here when it is ready.":
    "正在启动 WhatsApp 配对桥，二维码就绪后会出现在这里。",
  "choose how to connect your telegram bot": "选择如何连接你的 Telegram 机器人",
  "both options connect a bot you control and save its credentials only to this hermes installation.":
    "两种方式连的都是你自己的机器人，凭据只保存在本机这套 Hermes 里。",
  "scan a qr code and confirm in telegram. hermes creates the bot and detects your telegram user id automatically.":
    "扫二维码并在 Telegram 里确认。Hermes 会自动创建机器人并识别你的 Telegram 用户 ID。",
  "create a bot with @botfather, or connect one you already have, by entering its token and choosing who can use it.":
    "用 @BotFather 创建机器人，或直接连一个已有的：填入它的 token，并选择谁能使用。",
  "telegram credentials are already configured. a new qr setup or bot token will replace the current bot when you save.":
    "Telegram 凭据已配置。保存后，新的扫码设置或机器人 token 会替换当前的机器人。",
  // 平台简介
  "run hermes from telegram dms, groups, and topics.": "通过 Telegram 私聊、群组和话题使用 Hermes。",
  "connect hermes to discord dms, channels, and threads.": "接入 Discord 私聊、频道和子区。",
  "use hermes from slack via socket mode. add allowed slack member ids so connected bots can respond.":
    "通过 Socket Mode 在 Slack 里使用 Hermes。添加允许的 Slack 成员 ID，机器人才能响应。",
  "connect hermes to mattermost channels and direct messages.": "接入 Mattermost 频道和私信。",
  "use hermes in matrix rooms and direct messages.": "在 Matrix 房间和私信里使用 Hermes。",
  "use hermes through the bundled whatsapp bridge with qr-based auth.":
    "通过内置的 WhatsApp 桥（扫码认证）使用 Hermes。",
  "connect through a signal-cli rest bridge.": "通过 signal-cli REST 桥接入。",
  "use hermes through imessage via a bluebubbles server.": "通过 BlueBubbles 服务用 iMessage 使用 Hermes。",
  "talk to hermes through an imap/smtp mailbox.": "通过 IMAP/SMTP 邮箱和 Hermes 对话。",
  "send and receive text messages via twilio.": "通过 Twilio 收发短信。",
  "connect hermes to dingtalk groups (钉钉).": "接入钉钉群。",
  "connect hermes to google chat via cloud pub/sub.": "通过 Cloud Pub/Sub 接入 Google Chat。",
  "send-only wecom group bot via webhook.": "通过 webhook 的只发不收企业微信群机器人。",
  "two-way wecom integration via callback app.": "通过回调应用的企微双向集成。",
  "connect a personal wechat account through tencent's ilink bot api.":
    "通过腾讯 iLink Bot API 接入个人微信。",
  "connect hermes to a qq bot from the qq open platform.": "接入 QQ 开放平台的 QQ 机器人。",
  "connect hermes to tencent yuanbao.": "接入腾讯元宝。",
  "expose hermes as an openai-compatible http api for tools like open webui.":
    "把 Hermes 暴露成 OpenAI 兼容的 HTTP API，供 Open WebUI 之类的工具使用。",
  "receive events from github, gitlab, and other webhook sources.": "接收 GitHub、GitLab 等 webhook 来源的事件。",
  "no extra packages needed (stdlib only)": "无需额外依赖（仅标准库）",
  "use hermes through imessage via photon's managed spectrum platform.":
    "通过 Photon 托管的 Spectrum 平台用 iMessage 使用 Hermes。",
  "relay messages between an irc channel (or dms) and hermes.": "在 IRC 频道（或私信）与 Hermes 之间转发消息。",
  "use hermes from line via the line messaging api webhook.": "通过 LINE Messaging API webhook 在 LINE 里使用 Hermes。",
  "receive microsoft graph change notifications (teams meetings, outlook, …).":
    "接收 Microsoft Graph 变更通知（Teams 会议、Outlook 等）。",
  "connect hermes to microsoft teams chats via the bot framework.": "通过 Bot Framework 接入 Microsoft Teams 聊天。",
  "chat with hermes over ntfy push topics (ntfy.sh or self-hosted).":
    "通过 ntfy 推送主题（ntfy.sh 或自建）和 Hermes 聊天。",
  "join a raft workspace as an external agent.": "以外部智能体身份加入 Raft 工作区。",
  "generic relay adapter fronted by the hermes relay connector.":
    "由 Hermes Relay 连接器前置的通用中继适配器。",
  "talk to hermes over simplex chat via a local simplex-chat daemon.":
    "通过本地 simplex-chat 守护进程在 SimpleX Chat 里聊天。",
  "use hermes via meta's hosted whatsapp cloud api (no local bridge).":
    "通过 Meta 托管的 WhatsApp Cloud API 使用 Hermes（无需本地桥）。",
  "use hermes inside feishu / lark.": "在飞书里使用 Hermes。",
  "api server": "API 服务",
  "relay (experimental)": "中继（实验性）",
  "wecom (group bot)": "WeCom（群机器人）",
  "wecom (app)": "WeCom（应用）",

  // ══════════════════════════════════════════════════════════════════════
  // Webhook 页（/webhooks）
  // ══════════════════════════════════════════════════════════════════════
  "webhooks": "Webhook",
  "new subscription": "新建订阅",
  "webhook receiver disabled": "Webhook 接收器已停用",
  "webhooks are their own gateway platform. enable them here to accept incoming http events; chat channels are only needed when a subscription delivers to telegram, discord, slack, or another channel.":
    "Webhook 是独立的网关平台。在这里启用后就能接收外部 HTTP 事件；只有当订阅要投递到 Telegram、Discord、Slack 等聊天渠道时，才需要配置渠道。",
  "enable webhooks": "启用 Webhook",
  "subscription changes hot-reload once the webhook receiver is running. disabled subscriptions reject incoming events.":
    "接收器运行后，订阅改动会自动热加载。已停用的订阅会拒绝接收事件。",
  "no webhook subscriptions yet.": "还没有 webhook 订阅。",
  "subscriptions": "订阅",
  "pending requests": "待处理请求",
  "approved users": "已批准的用户",
  "retrying": "重试中",
  "deliver only": "只投递",
  "deliver to": "投递到",
  "skip the agent, deliver payload directly": "跳过智能体，直接投递负载",
  "what this webhook does (optional)": "这个 webhook 的用途（可选）",
  "instructions for the agent when this webhook fires (optional)":
    "webhook 触发时给智能体的指令（可选）",
  "comma-separated, leave empty for all": "逗号分隔，留空表示全部",
  "e.g. github-push": "例如 github-push",
  "secret (shown once)": "密钥（只显示一次）",
  "webhook url": "Webhook 地址",
  "subscription created. copy the secret now — it is only shown once.":
    "订阅已创建。现在就把密钥复制走 —— 它只显示一次。",
  "this will permanently remove this webhook subscription.": "这会永久删除该 webhook 订阅。",
  "name required": "名称必填",
  "webhooks are enabled, but the gateway still needs a restart before the receiver can come online.":
    "Webhook 已启用，但接收器要等网关重启后才能上线。",
  "webhooks enabled; gateway restarting…": "Webhook 已启用；网关正在重启…",
  "enabling…": "启用中…",
  "creating…": "创建中…",
  "created ✓": "已创建 ✓",
  "failed to load webhooks": "加载 webhook 失败",
  "github comment": "GitHub 评论",
  "events": "事件",
  "prompt": "提示词",
  "description": "描述",
  "done": "完成",
  "log": "日志",
  "(all)": "（全部）",

  // ══════════════════════════════════════════════════════════════════════
  // 配对页（/pairing）
  // ══════════════════════════════════════════════════════════════════════
  "pairing": "配对",
  "no pending pairing requests": "没有待处理的配对请求",
  "no approved users": "还没有已批准的用户",
  "approve": "批准",
  "clear pending": "清除待处理",
  "this user will lose access. this cannot be undone.": "该用户将失去访问权限，且无法撤销。",
  "clear all pending pairing requests?": "清除所有待处理的配对请求？",
  "failed to load pairing requests": "加载配对请求失败",
  "missing pairing request": "找不到该配对请求",

  // ══════════════════════════════════════════════════════════════════════
  // 技能页（/skills）
  // ══════════════════════════════════════════════════════════════════════
  "browse hub": "浏览技能中心",
  "learn a skill": "学一个技能",
  "new skill": "新建技能",
  "update all": "全部更新",
  "details": "详情",
  "featured skills": "精选技能",
  "connected hubs:": "已连接的知识源：",
  "connecting to skill hubs…": "正在连接技能源…",
  "couldn't load the skill source.": "无法加载技能来源。",
  "no matching skills found in the hub.": "技能中心里没有匹配的技能。",
  "search the hub above to browse installable skills from the connected sources.":
    "用上面的搜索框浏览已连接来源里可安装的技能。",
  "read skill.md": "查看 SKILL.md",
  "run a security scan to inspect this skill for risky patterns before installing.":
    "安装前先做一次安全扫描，看看这个技能有没有危险模式。",
  "no risky patterns detected": "未发现危险模式",
  "fetching, quarantining, and scanning…": "正在抓取、隔离并扫描…",
  "updating installed skills…": "正在更新已安装技能…",
  "from the hermes index — search above for thousands more": "来自 Hermes 索引 —— 上面搜索还有几千个",
  "local file or directory": "本地文件或目录",
  "anything else — describe the workflow, paste notes, or say \"what we just did\"":
    "其他任何输入 —— 描述流程、粘贴笔记，或说「我们刚才做的」",
  "point hermes at anything and it will distill a reusable skill — following the house authoring standards. fill in any combination below; the agent gathers the sources and writes the skill in chat.":
    "给 Hermes 任何东西，它都会按内部编写规范提炼成可复用技能。下面随便填几项；智能体会自己收集来源并在对话里把技能写好。",
  "learn it": "开始学习",
  "dismiss": "忽略",
  "safe": "安全",
  "caution": "谨慎",
  "dangerous": "危险",
  "security scan": "安全扫描",
  "install allowed": "允许安装",
  "install blocked": "禁止安装",
  "needs confirmation": "需确认",
  "re-scan": "重新扫描",
  "centralized index unavailable — falling back to live sources": "中心索引不可用 —— 回退到实时来源",
  "github api rate-limited — set github_token to raise the limit":
    "GitHub API 被限流 —— 设置 GITHUB_TOKEN 可提高额度",
  "search the skill hub (github, official, community)…": "搜索技能中心（GitHub、官方、社区）…",
  "e.g. how i file an expense report: open the portal, …": "例如：我怎么报销差旅费——打开门户…",
  "https://docs.example.com/api  (fetched with web_extract)": "https://docs.example.com/api（用 web_extract 抓取）",
  "~/projects/some-sdk  (read with read_file / search_files)": "~/projects/some-sdk（用 read_file / search_files 读取）",
  // 技能分类（来源标签）
  "apple": "Apple",
  "autonomous ai agents": "自主智能体",
  "creative": "创意",
  "email": "邮件",
  "media": "媒体",
  "note taking": "笔记",
  "productivity": "生产力",
  "social media": "社交媒体",
  "software development": "软件开发",
  "red teaming": "红队测试",
  "devops": "DevOps",
  "research": "研究",
  "web": "网页",
  "omh": "OMH",
  "reverse-engineer-anything": "逆向工程",

  // ══════════════════════════════════════════════════════════════════════
  // 分析页（/analytics）
  // ══════════════════════════════════════════════════════════════════════
  "token analytics hidden": "令牌统计已隐藏",
  "the token, cost, and per-day analytics on this page are a local debug estimate. they only count successful main-agent responses with a usable usage block, and silently exclude auxiliary calls (context compression, title generation, vision, session search, web extract, smart approvals, mcp routing, plugin llm access) plus provider-side retries and fallback attempts. cache writes are missing entirely.":
    "本页的令牌、费用和每日分析都是本地调试估值：只统计带 usage 块的主智能体成功响应，且会静默排除辅助调用（上下文压缩、标题生成、视觉、会话检索、网页抓取、智能审批、MCP 路由、插件 LLM 调用）以及提供方侧重试和回退尝试，缓存写入完全没有计入。",
  "on models with heavy auxiliary traffic (kimi k2.6, minimax m2.7) the local total can be 10x–100x lower than what your provider bills. hiding these numbers is safer than letting them look authoritative.":
    "在辅助流量很大的模型上（Kimi K2.6、MiniMax M2.7），本地总量可能比提供方账单低 10 到 100 倍。把数字藏起来，比让它们看着像权威数据更安全。",
  "check your provider dashboard (openrouter, anthropic, etc.) for actual usage and billing. to re-enable the local debug estimate anyway, set dashboard.show_token_analytics: true in config.":
    "真实用量和账单请看提供方后台（OpenRouter、Anthropic 等）。确实想恢复本地调试估值，就在「配置」里把 dashboard.show_token_analytics 设为 true。",

  // ══════════════════════════════════════════════════════════════════════
  // 配置页（/config）—— 只翻页面 chrome，键名保持原样
  // ══════════════════════════════════════════════════════════════════════
  "attachments": "附件",
  "curator": "技能管理器",
  "database": "数据库",
  "desktop": "桌面",
  "local_runtime": "本地运行时",
  "loops": "循环",
  "moa": "MoA",
  "model_catalog": "模型目录",
  "monitoring": "监控",
  "proxy": "代理",
  "secrets": "密钥",
  "sessions": "会话",
  "streaming": "流式",
  "tool_loop_guardrails": "工具循环护栏",
  "tool_output": "工具输出",
  "tools": "工具",
  "toolsets": "工具集",
  "vault": "保险库",
  "vision": "视觉",
  "wake_word": "唤醒词",
  "worktrees": "工作树",
  "x_search": "X 搜索",
  "bot_desktop": "桌面机器人",
  "default model (e.g. anthropic/claude-sonnet-4.6)": "默认模型（例如 anthropic/claude-sonnet-4.6）",
  "context window override (0 = auto-detect from model metadata)":
    "上下文窗口覆盖值（0 = 从模型元数据自动检测）",
  "iana timezone (e.g. america/new_york). blank uses the system timezone.":
    "IANA 时区（例如 Asia/Shanghai）。留空则用系统时区。",
  "comma-separated values": "逗号分隔的多个值",
  "when the chat app / gateway updates hermes (no terminal prompt), what to do with uncommitted local source edits. 'stash' keeps them and re-applies them after the update; 'discard' throws them away. terminal updates always ask, regardless of this setting.":
    "聊天应用 / 网关触发 hermes 更新时（没有终端交互），本地未提交的源码改动怎么处理：'stash' 先暂存、更新后重新应用；'discard' 直接丢弃。在终端里更新 Hermes 时不受此项影响，永远会问。",
  "refresh an already-installed cua-driver during hermes update. disable this on non-admin macos accounts where /applications is not writable.":
    "hermes 更新时顺便刷新已安装的 cua-driver。在 /Applications 不可写的非管理员 macOS 账号上请关掉。",

  // ══════════════════════════════════════════════════════════════════════
  // 密钥页（/keys）
  // ══════════════════════════════════════════════════════════════════════
  "keys": "密钥",

};

// 带插值 / 局部片段的串用正则（文本节点可能被 React 拆成多段）
const ZH_RULES: Array<[RegExp, string]> = [
  [/^repeat: forever$/i, "重复：永久"],
  [/^repeat: (\d+)$/i, "重复：$1 次"],
  [/^every (\d+)h$/i, "每 $1 小时"],
  [/^every (\d+)m$/i, "每 $1 分钟"],
  [/^· last run (.+)$/i, "· 上次运行 $1"],
  [/^(\d+) cores? · (\d+)%$/i, "$1 核 · $2%"],
  [/^(\d+) cores?$/i, "$1 核"],
  [/^built-in files — (.+)$/i, "内置文件 —— $1"],
  [/^served by the shared gateway with (.+)\.$/i, "由共享网关提供服务：$1。"],
  [/^inference provider: (.+)$/i, "推理提供方：$1"],
  [/^(\d+) hooks?$/i, "$1 个钩子"],
  [/^(\d+) tools?$/i, "$1 个工具"],
  [/^(\d+) tasks? · all auto$/i, "$1 个任务 · 全部自动"],
  [/^(\d+)d (\d+)h (\d+)m$/i, "$1 天 $2 小时 $3 分"],
  [/^weekdays at (.+)$/i, "工作日 $1"],
  [/^every day at (.+)$/i, "每天 $1"],
  // ── MCP 页 ──
  [/^your mcp servers \((\d+)\)$/i, "MCP 服务器（$1）"],
  [/^catalog \((\d+)\)$/i, "目录（$1）"],
  [/^(\d+) env vars?$/i, "$1 个环境变量"],
  [/^auth: oauth$/i, "认证：OAuth"],
  [/^auth: none$/i, "认证：无"],
  [/^auth: api key$/i, "认证：API 密钥"],
  [/^auth: token$/i, "认证：令牌"],
  [/^auth: (.+)$/i, "认证：$1"],
  [/^tools: (.+)$/i, "工具：$1"],
  [/^installed \((\d+)\)$/i, "已安装（$1）"],
  // ── Webhook / 配对页 ──
  [/^subscriptions \((\d+)\)$/i, "订阅（$1）"],
  [/^pending requests \((\d+)\)$/i, "待处理请求（$1）"],
  [/^approved users \((\d+)\)$/i, "已批准的用户（$1）"],
  [/^(\d+) pending$/i, "$1 个待处理"],
  [/^(\d+) subscriptions?$/i, "$1 个订阅"],
  [/^(.+) connect timed out after (\d+)s$/i, "连接 $1 超时（$2 秒）"],
  [/^logged in as (.+)$/i, "已登录为 $1"],
  // ── 渠道页汇总行 ──
  [/^(\d+) of (\d+) channels configured\. credentials are written to (.+); the gateway connects each enabled channel on its next restart\.$/i,
    "$2 个渠道里已配置 $1 个。凭据写入 $3；网关会在下次重启时连接已启用的渠道。"],
];

// 「动词 + 对象」型按钮 / tooltip。对象必须是短标签（不像整句），
// 否则会把说明段落拆成「刷新 an already-installed …」这种半中半英（实测踩过）。
const ZH_VERB_RULES: Array<[RegExp, string]> = [
  [/^delete (.+)$/i, "删除 $1"],
  [/^download (.+)$/i, "下载 $1"],
  [/^open (.+)$/i, "打开 $1"],
  [/^rename (.+)$/i, "重命名 $1"],
  [/^refresh (.+)$/i, "刷新 $1"],
  [/^reset (.+)$/i, "重置 $1"],
  [/^upload (.+)$/i, "上传 $1"],
  [/^enable (.+)$/i, "启用 $1"],
  [/^edit (.+)$/i, "编辑 $1"],
  [/^disable (.+)$/i, "禁用 $1"],
];

function verbTargetOk(rest: string): boolean {
  const r = rest.trim();
  return r.length > 0 && r.length <= 60 && !/[.;:!?]/.test(r) && r.split(/\s+/).length <= 8;
}

const ATTRS = ["title", "placeholder", "aria-label"] as const;
// 这些标签里放的是命令、路径、配置键、代码 —— 属数据，翻了反而看不懂
const SKIP_TAGS = new Set(["CODE", "PRE", "KBD", "SAMP", "SCRIPT", "STYLE"]);

function zhOn(): boolean {
  try {
    const l = localStorage.getItem("hermes-locale");
    if (l) return l === "zh" || l === "zh-hant";
  } catch {
    /* 隐私模式下降级到 <html lang> */
  }
  return (document.documentElement.getAttribute("lang") || "").toLowerCase().startsWith("zh");
}

/** 多行 JSX 文本在 DOM 里带换行 / 多空格，字典按折叠后的串查 */
function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

/** 保留首尾空白，只替换匹配到的正文 */
function replaceKeepWs(orig: string, norm: string, repl: string): string {
  const i = orig.indexOf(norm);
  return i < 0 ? repl : orig.slice(0, i) + repl + orig.slice(i + norm.length);
}

function translate(s: string, verbs = false): string {
  const t = normalize(s);
  if (!t) return s;
  const hit = ZH_TEXT[t.toLowerCase()];
  if (hit !== undefined) return replaceKeepWs(s, t, hit);
  for (const [re, rep] of ZH_RULES) {
    if (!re.test(t)) continue;
    const out = t.replace(re, rep);
    if (out !== t) return replaceKeepWs(s, t, out);
  }
  if (!verbs) return s;
  for (const [re, rep] of ZH_VERB_RULES) {
    const m = re.exec(t);
    if (!m || !verbTargetOk(m[1] ?? "")) continue;
    const out = t.replace(re, rep);
    if (out !== t) return replaceKeepWs(s, t, out);
  }
  return s;
}

/**
 * 块级兜底：React 常把一句说明拆成多个文本节点（中间夹 <code>/<strong>），
 * 逐节点翻永远对不上整句。这里按元素级 textContent 匹配一次，命中就整段替换。
 * 含表单控件 / 图标 / 链接的元素一律不碰（替换会丢控件）。
 */
const BLOCK_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6", "P", "LI", "TH", "TD", "LABEL", "DIV", "SPAN",
]);
const BLOCK_FORBID = "button,input,select,textarea";
const BLOCK_LEAF_ONLY = new Set(["DIV", "SPAN", "LABEL"]);
const DECOR = /^(svg|img)$/i;

function blockScan(root: ParentNode): void {
  root.querySelectorAll?.("h1,h2,h3,h4,h5,h6,p,li,th,td,label,div,span").forEach((el) => {
    if (!BLOCK_TAGS.has(el.tagName)) return;
    if (BLOCK_LEAF_ONLY.has(el.tagName) && el.children.length > 0) return;
    if (el.querySelector(BLOCK_FORBID)) return;
    const whole = el.textContent || "";
    if (!whole.trim() || whole.length > 1200) return;
    const next = translate(whole);
    if (next === whole) return;
    // 图标（<svg>/<img>）是装饰，保留并放回原位之前的顺序：图标在前、译文在后
    const decor = Array.from(el.children).filter((c) => DECOR.test(c.tagName));
    const otherKids = Array.from(el.children).filter((c) => !DECOR.test(c.tagName));
    if (otherKids.length > 0) {
      // 夹着 <code>/<strong> 这类行内标记：整段替换为纯文本（丢标记但文案正确）
      el.textContent = next;
      return;
    }
    el.textContent = "";
    decor.forEach((c) => el.appendChild(c));
    el.appendChild(document.createTextNode(next));
  });
}

function skipped(node: Node): boolean {
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!el) return false;
  if (SKIP_TAGS.has(el.tagName)) return true;
  return !!el.closest("[data-zh-skip]");
}

function walkText(node: Text): void {
  const v = node.nodeValue;
  if (!v || skipped(node)) return;
  const next = translate(v);
  if (next !== v) node.nodeValue = next;
}

function walkAttrs(el: Element): void {
  if (skipped(el)) return;
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (!v) continue;
    const next = translate(v, true);
    if (next !== v) el.setAttribute(a, next);
  }
}

function scan(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    walkText(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  const el = root as Element;
  if (el.nodeType === Node.ELEMENT_NODE) walkAttrs(el);
  el.querySelectorAll?.("*").forEach(walkAttrs);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = walker.nextNode();
  while (n) {
    walkText(n as Text);
    n = walker.nextNode();
  }
  blockScan(root as ParentNode);
}

let started = false;

export function startZhDomOverlay(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  const apply = (): void => {
    if (!zhOn()) return;
    scan(document.body);
    const title = document.title;
    if (title.includes("Hermes Agent - Dashboard")) {
      document.title = title.replace("Hermes Agent - Dashboard", "Hermes 智能体 · 控制台");
    }
  };

  // 首屏 + 之后每次 React 变更都重新扫（翻译结果稳定后不再写 DOM，不会自激）
  apply();
  // 用 setTimeout 而不是 requestAnimationFrame：后台标签页里 rAF 不触发，
  // 覆盖层就会静默失效（实测踩过）。定时器即使被节流也会跑。
  let queued = false;
  const schedule = (): void => {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      apply();
    }, 0);
  };
  new MutationObserver(schedule).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS],
  });
  window.addEventListener("storage", schedule);
}
