/* @ds-bundle: {"format":4,"namespace":"MatholicDesignSystem_e6d312","components":[{"name":"Button","sourcePath":"components/Button.jsx"},{"name":"ButtonGroup","sourcePath":"components/ButtonGroup.jsx"},{"name":"Card","sourcePath":"components/Card.jsx"},{"name":"Checkbox","sourcePath":"components/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/IconButton.jsx"},{"name":"Input","sourcePath":"components/Input.jsx"},{"name":"OnOffButton","sourcePath":"components/OnOffButton.jsx"},{"name":"Pagination","sourcePath":"components/Pagination.jsx"},{"name":"ScoreChip","sourcePath":"components/ScoreChip.jsx"},{"name":"Select","sourcePath":"components/Select.jsx"},{"name":"Tag","sourcePath":"components/Tag.jsx"},{"name":"Toggle","sourcePath":"components/Toggle.jsx"},{"name":"Tooltip","sourcePath":"components/Tooltip.jsx"}],"sourceHashes":{"components/Button.jsx":"930099b3e932","components/ButtonGroup.jsx":"134c3f8ff609","components/Card.jsx":"f0ecdecb1088","components/Checkbox.jsx":"7861141d1236","components/IconButton.jsx":"673db436312d","components/Input.jsx":"458f8c7a2a01","components/OnOffButton.jsx":"d5ba64dc9cba","components/Pagination.jsx":"fc2232bbf1bf","components/ScoreChip.jsx":"109f2d43f380","components/Select.jsx":"d696a6d6788e","components/Tag.jsx":"0d1a613893af","components/Toggle.jsx":"3b0ced17850d","components/Tooltip.jsx":"47eed3fc0607","ui_kits/web_dashboard/AppShell.jsx":"dd8f96d12f47","ui_kits/web_dashboard/Components.jsx":"a9d58c128c77","ui_kits/web_dashboard/LearningStatus.jsx":"d2f700cd1330","ui_kits/web_dashboard/SmsCompose.jsx":"d2f360f91e4b","ui_kits/web_dashboard/WorksheetList.jsx":"5c895c0aaae9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MatholicDesignSystem_e6d312 = window.MatholicDesignSystem_e6d312 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  icon,
  onClick,
  style,
  ...rest
}) {
  const variants = {
    primary: {
      background: mh.primary,
      color: '#fff',
      border: '1px solid ' + mh.primary
    },
    sub: {
      background: '#fff',
      color: mh.primaryHover,
      border: '1px solid ' + mh.primaryHover
    },
    ghost: {
      background: 'transparent',
      color: mh.fg2,
      border: '1px solid ' + mh.line
    }
  };
  const s = disabled ? {
    background: mh.bgPage,
    color: mh.fg4,
    border: '1px solid ' + mh.line
  } : variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: disabled ? undefined : onClick,
    disabled: !!disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: size === 'sm' ? 28 : 32,
      padding: size === 'sm' ? '0 12px' : '0 15px',
      borderRadius: 6,
      font: '500 14px/1 var(--mh-font)',
      transition: 'background .15s ease-out, color .15s ease-out',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...s,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button.jsx", error: String((e && e.message) || e) }); }

// components/ButtonGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
/* Row of 2+ buttons — the gap is always 12px. */
function ButtonGroup({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { ButtonGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ButtonGroup.jsx", error: String((e && e.message) || e) }); }

// components/Card.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
function Card({
  children,
  style,
  padding = 20
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid ' + mh.line,
      borderRadius: 10,
      padding,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Card.jsx", error: String((e && e.message) || e) }); }

// components/Checkbox.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  half
}) {
  const on = checked || half;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? mh.fg4 : mh.fg,
      font: 'var(--mh-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 4,
      flex: '0 0 auto',
      border: '1px solid ' + (disabled ? mh.line : on ? mh.primary : mh.fg4),
      background: disabled ? mh.bgPage : on ? mh.primary : '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700
    }
  }, half ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 2,
      background: '#fff',
      borderRadius: 1
    }
  }) : checked ? '✓' : ''), label ? /*#__PURE__*/React.createElement("span", null, label) : null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      display: 'none'
    }
  }));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  primary100: '#CFE6FF',
  fg: '#212121',
  fg2: '#555',
  fg4: '#999',
  line: '#D9D9D9',
  bgPage: '#F7F8F9',
  bgMuted: '#EEEEEE'
};
const {
  useState
} = React;
function Gear({
  s
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
  }));
}

/* Square icon-only button. Only two sizes exist: 32 and 28. */
function IconButton({
  size = 32,
  variant = 'outline',
  disabled,
  label,
  icon,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const box = size === 28 ? 28 : 32;
  const glyph = box === 28 ? 16 : 18;
  let s;
  if (variant === 'ghost') {
    s = {
      background: press ? mh.bgMuted : hover ? mh.bgPage : 'transparent',
      color: hover || press ? mh.fg : mh.fg2,
      border: '1px solid transparent'
    };
  } else {
    s = {
      background: press ? mh.primary100 : hover ? mh.primary50 : '#fff',
      color: press ? mh.primaryHover : mh.primary,
      border: '1px solid ' + (press ? mh.primaryHover : mh.primary)
    };
  }
  if (disabled) s = {
    background: mh.bgPage,
    color: mh.fg4,
    border: '1px solid ' + mh.line
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: !!disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      width: box,
      height: box,
      flex: '0 0 auto',
      padding: 0,
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background .15s ease-out, color .15s ease-out, border-color .15s ease-out',
      ...s,
      ...style
    }
  }, rest), icon ?? /*#__PURE__*/React.createElement(Gear, {
    s: glyph
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
const {
  useState
} = React;
function Input({
  placeholder,
  value,
  onChange,
  error,
  disabled,
  style,
  icon,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const base = {
    height: 32,
    padding: '0 12px',
    borderRadius: 6,
    background: disabled ? mh.bgPage : '#fff',
    border: '1px solid ' + (error ? mh.danger : focus ? mh.primary : mh.line),
    boxShadow: focus && !error ? '0 0 0 2px rgba(22,119,255,0.15)' : 'none',
    font: '400 14px/1 var(--mh-font)',
    color: disabled ? mh.fg4 : mh.fg,
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      ...base,
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: mh.fg4,
      display: 'inline-flex'
    }
  }, icon) : null, /*#__PURE__*/React.createElement("input", _extends({
    value: value ?? '',
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onChange: e => onChange && onChange(e.target.value),
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      font: 'inherit',
      color: 'inherit',
      minWidth: 0
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Input.jsx", error: String((e && e.message) || e) }); }

// components/OnOffButton.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  primary100: '#CFE6FF',
  fg: '#212121',
  fg2: '#555',
  fg4: '#999',
  line: '#D9D9D9',
  bgPage: '#F7F8F9',
  bgMuted: '#EEEEEE'
};
const {
  useState
} = React;
const icons = {
  check: /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })),
  eye: /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })),
  eyeOff: /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 21 21 3"
  }))
};
function Half({
  variant,
  active,
  disabled,
  label,
  icon,
  width,
  onClick
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  let s;
  if (variant === 'soft') {
    s = active ? {
      background: press ? mh.primary100 : mh.primary50,
      color: mh.primary,
      border: '1px solid transparent',
      fontWeight: 600
    } : {
      background: press ? mh.bgMuted : mh.bgPage,
      color: hover ? mh.fg : mh.fg2,
      border: '1px solid transparent',
      fontWeight: 500
    };
  } else {
    s = active ? {
      background: press ? mh.primary100 : mh.primary50,
      color: mh.primary,
      border: '1px solid ' + mh.primary,
      fontWeight: 600
    } : {
      background: '#fff',
      color: hover || press ? mh.primary : mh.fg,
      border: '1px solid ' + (hover || press ? mh.primary : mh.line),
      fontWeight: 500
    };
  }
  if (disabled) s = {
    background: mh.bgPage,
    color: mh.fg4,
    border: '1px solid ' + mh.line,
    fontWeight: 500
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: !!disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    "aria-pressed": !!active,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 32,
      padding: '0 15px',
      width: width,
      borderRadius: 6,
      font: '14px/1 var(--mh-font)',
      fontWeight: s.fontWeight,
      letterSpacing: '-0.005em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background .15s ease-out, color .15s ease-out, border-color .15s ease-out',
      background: s.background,
      color: s.color,
      border: s.border
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon) : null, label);
}

/* ON/OFF pair. Two lined-up buttons — gap is the DS button-row 12px. */
function OnOffButton({
  value = 'off',
  onChange,
  variant = 'outline',
  disabled,
  offLabel = 'OFF',
  onLabel = 'ON',
  width = 100,
  style
}) {
  const isOn = value === 'on' || value === true;
  const set = v => onChange && onChange(v);
  const offIcon = variant === 'soft' ? icons.eyeOff : null;
  const onIcon = variant === 'soft' ? icons.eye : icons.check;
  return /*#__PURE__*/React.createElement("div", {
    role: "group",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement(Half, {
    variant: variant,
    active: !isOn,
    disabled: disabled,
    label: offLabel,
    icon: offIcon,
    width: width,
    onClick: () => set('off')
  }), /*#__PURE__*/React.createElement(Half, {
    variant: variant,
    active: isOn,
    disabled: disabled,
    label: onLabel,
    icon: onIcon,
    width: width,
    onClick: () => set('on')
  }));
}
Object.assign(__ds_scope, { OnOffButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/OnOffButton.jsx", error: String((e && e.message) || e) }); }

// components/Pagination.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
function Pagination({
  page = 1,
  total = 3,
  onChange
}) {
  const pages = Array.from({
    length: total
  }, (_, i) => i + 1);
  const item = (key, label, {
    active,
    disabled,
    onClick
  }) => /*#__PURE__*/React.createElement("span", {
    key: key,
    onClick: disabled ? undefined : onClick,
    style: {
      width: 32,
      height: 32,
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '700 14px/1 var(--mh-font)',
      cursor: disabled ? 'default' : 'pointer',
      background: active ? mh.primary50 : 'transparent',
      border: '1px solid ' + (active ? mh.primary : 'transparent'),
      color: active ? mh.primary : disabled ? mh.line : mh.fg
    }
  }, label);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, item('prev', '‹', {
    disabled: page === 1,
    onClick: () => onChange && onChange(page - 1)
  }), pages.map(n => item(n, n, {
    active: n === page,
    onClick: () => onChange && onChange(n)
  })), item('next', '›', {
    disabled: page === total,
    onClick: () => onChange && onChange(page + 1)
  }));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/ScoreChip.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
function ScoreChip({
  value = 0
}) {
  const c = value >= 80 ? {
    fg: '#20AF66',
    bd: '#B1E266'
  } : value >= 50 ? {
    fg: mh.warning,
    bd: mh.warningBorder
  } : {
    fg: mh.danger,
    bd: mh.dangerBorder
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      height: 22,
      padding: '0 8px',
      borderRadius: 4,
      border: '1px solid ' + c.bd,
      color: c.fg,
      font: '700 12px/1 var(--mh-font)',
      alignItems: 'center'
    }
  }, value);
}
Object.assign(__ds_scope, { ScoreChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ScoreChip.jsx", error: String((e && e.message) || e) }); }

// components/Select.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
const {
  useState
} = React;
function Select({
  value,
  options = [],
  placeholder = '선택',
  onChange,
  width = 120,
  style
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      fontFamily: 'var(--mh-font)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    style: {
      height: 32,
      padding: '0 10px',
      borderRadius: 6,
      background: '#fff',
      border: '1px solid ' + (open ? mh.primary : mh.line),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      font: '400 14px/1 var(--mh-font)',
      color: value ? mh.fg : mh.fg4
    }
  }, /*#__PURE__*/React.createElement("span", null, value ?? placeholder), /*#__PURE__*/React.createElement("span", {
    style: {
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '5px solid ' + (open ? mh.primary : mh.fg4)
    }
  })), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 36,
      left: 0,
      right: 0,
      zIndex: 20,
      background: '#fff',
      border: '1px solid ' + mh.line,
      borderRadius: 6,
      boxShadow: '0 6px 16px rgba(0,35,11,0.2)',
      padding: '4px 0',
      maxHeight: 280,
      overflow: 'auto'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("div", {
    key: o,
    onClick: () => {
      onChange && onChange(o);
      setOpen(false);
    },
    style: {
      padding: '8px 12px',
      font: '400 14px/1 var(--mh-font)',
      cursor: 'pointer',
      color: o === value ? mh.primary : mh.fg,
      background: o === value ? mh.primary50 : 'transparent',
      fontWeight: o === value ? 600 : 400
    }
  }, o))) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Select.jsx", error: String((e && e.message) || e) }); }

// components/Tag.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
function Tag({
  color = 'blue',
  children,
  removable,
  onRemove
}) {
  const tones = {
    blue: {
      bg: mh.primary50,
      fg: mh.primary,
      bd: 'rgba(22,119,255,0.3)'
    },
    red: {
      bg: mh.dangerBg,
      fg: mh.dangerStrong,
      bd: mh.dangerBorder
    },
    green: {
      bg: mh.successBg,
      fg: mh.success,
      bd: mh.successBorder
    },
    orange: {
      bg: '#FFF7E6',
      fg: mh.warning,
      bd: mh.warningBorder
    },
    gray: {
      bg: mh.bgPage,
      fg: mh.fg2,
      bd: mh.line
    },
    teal: {
      bg: '#E6FFFB',
      fg: '#359795',
      bd: 'rgba(53,151,149,0.35)'
    }
  };
  const t = tones[color] || tones.blue;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 20,
      padding: '0 8px',
      borderRadius: 4,
      font: '500 12px/1 var(--mh-font)',
      background: t.bg,
      color: t.fg,
      border: '1px solid ' + t.bd
    }
  }, children, removable ? /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      cursor: 'pointer',
      marginLeft: 2
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Tag.jsx", error: String((e && e.message) || e) }); }

// components/Toggle.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryLight: '#91C4FF',
  fg: '#212121',
  fg4: '#999',
  line: '#D9D9D9',
  lineStrong: '#8C8C8C'
};

/* Toggle switch. size 'lg' = 44×22 (default), 'sm' = 28×16 for dense rows.
   trackLabel puts short text inside the lg track, opposite the knob. */
function Toggle({
  on,
  onChange,
  label,
  trackLabel,
  size = 'lg',
  disabled
}) {
  const lg = size === 'lg';
  const h = lg ? 22 : 16;
  const knob = lg ? 18 : 12;
  const pad = 2;
  const track = on ? disabled ? mh.primaryLight : mh.primary : disabled ? mh.line : lg ? mh.lineStrong : mh.line;
  const text = trackLabel && lg ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1 var(--mh-font)',
      color: '#fff',
      padding: on ? '0 4px 0 8px' : '0 8px 0 4px',
      whiteSpace: 'nowrap'
    }
  }, trackLabel) : null;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? mh.fg4 : mh.fg,
      font: 'var(--mh-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!on),
    style: {
      minWidth: lg ? 44 : 28,
      height: h,
      boxSizing: 'border-box',
      padding: pad,
      borderRadius: 999,
      background: track,
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0,
      justifyContent: text ? 'flex-start' : on ? 'flex-end' : 'flex-start',
      flexDirection: on ? 'row' : 'row-reverse',
      transition: 'background .15s ease-out'
    }
  }, text, /*#__PURE__*/React.createElement("span", {
    style: {
      width: knob,
      height: knob,
      flex: '0 0 auto',
      background: '#fff',
      borderRadius: '50%',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/Tooltip.jsx
try { (() => {
const mh = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bgPage: '#F7F8F9',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};
const {
  useState
} = React;
function Tooltip({
  label,
  children,
  direction = 'top'
}) {
  const [show, setShow] = useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, -6px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, 6px)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translate(6px, -50%)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translate(-6px, -50%)'
    }
  }[direction];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...pos,
      background: mh.fg,
      color: '#fff',
      padding: '6px 10px',
      borderRadius: 4,
      font: '400 12px/1 var(--mh-font)',
      whiteSpace: 'nowrap',
      zIndex: 50
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Tooltip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_dashboard/AppShell.jsx
try { (() => {
// AppShell — top GNB + right rail + body. Uses top_nav_icons.png sprite.
const {
  useState: useStateShell
} = React;
function AppShell({
  active = 'worksheet',
  onNav,
  children
}) {
  const NAV_ICONS_W = 776; // approximate sprite width
  const SLOT = 95; // approximate slot per icon in sprite
  const items = [{
    id: 'class',
    label: '수업'
  }, {
    id: 'worksheet',
    label: '학습지',
    badge: 'N'
  }, {
    id: 'textbook',
    label: '교재채점'
  }, {
    id: 'status',
    label: '학습현황'
  }, {
    id: 'diag',
    label: '진단평가'
  }, {
    id: 'arith',
    label: '연산대장'
  }, {
    id: 'test',
    label: '시험대장'
  }, {
    id: 'more',
    label: '더보기'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#FFFFFF',
      fontFamily: 'var(--mh-font)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 56,
      background: '#fff',
      borderBottom: '1px solid ' + mhColors.line,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 40,
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/matholic_logo.png",
    alt: "MATHOLIC",
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4,
      marginLeft: 20
    }
  }, items.map((it, i) => {
    const on = active === it.id;
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      onClick: () => onNav && onNav(it.id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '4px 10px',
        cursor: 'pointer',
        position: 'relative',
        color: on ? mhColors.primary : mhColors.fg2,
        font: (on ? 600 : 500) + ' 12px/1 var(--mh-font)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 24,
        height: 24,
        background: `url(../../assets/icons/top_nav_icons.png) -${i * SLOT + 8}px 2px / ${NAV_ICONS_W}px auto no-repeat`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, it.label), it.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -2,
        right: 6,
        width: 14,
        height: 14,
        borderRadius: 999,
        background: mhColors.danger,
        color: '#fff',
        font: '700 10px/1 var(--mh-font)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, it.badge), on && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 6,
        right: 6,
        bottom: -8,
        height: 2,
        background: mhColors.primary,
        borderRadius: 1
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      color: mhColors.fg2
    }
  }, /*#__PURE__*/React.createElement("span", {
    title: "\uC2E0\uACE0",
    style: {
      cursor: 'pointer'
    }
  }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("span", {
    title: "\uBB38\uC790",
    style: {
      cursor: 'pointer'
    }
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("span", {
    title: "\uC54C\uB9BC",
    style: {
      cursor: 'pointer'
    }
  }, "\uD83D\uDD14"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px 4px 4px',
      borderRadius: 999,
      border: '1px solid ' + mhColors.line,
      font: '500 13px/1 var(--mh-font)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: '#b5e31d',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 11
    }
  }, "\uD83D\uDE00"), "myoh \u25BE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: '20px 28px',
      minWidth: 0
    }
  }, children), /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 40,
      padding: '12px 0',
      borderLeft: '1px solid ' + mhColors.line,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      color: mhColors.fg2,
      fontSize: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    title: "\uD559\uC0DD"
  }, "\uD83D\uDC64"), /*#__PURE__*/React.createElement("span", {
    title: "\uCC44\uD305"
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("span", {
    title: "\uBCF4\uACE0\uC11C"
  }, "\uD83D\uDCD1"), /*#__PURE__*/React.createElement("span", {
    title: "\uCD5C\uADFC"
  }, "\u23F1"))));
}
window.AppShell = AppShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_dashboard/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_dashboard/Components.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared atoms for the Matholic UI kit.
// All components expose window.* globals so they can be imported via
// <script type="text/babel" src="Components.jsx"> across files.

const {
  useState
} = React;
const mhColors = {
  primary: '#1677FF',
  primaryHover: '#1166DE',
  primary50: '#E5F2FD',
  fg: '#212121',
  fg2: '#555',
  fg3: '#777',
  fg4: '#999',
  line: '#D9D9D9',
  lineSoft: '#EEE',
  bg: '#fff',
  bgPage: '#F7F8F9',
  bgMuted: '#EEE',
  danger: '#FB1A18',
  dangerStrong: '#CF1322',
  dangerBg: '#FFF1F0',
  dangerBorder: '#FF7D7C',
  success: '#389E0D',
  successBg: '#F6FFED',
  successBorder: '#B7EB8F',
  warning: '#D46B08',
  warningBorder: '#FFB968'
};

// ─── Button ────────────────────────────────────────────────────
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  icon,
  onClick,
  style,
  ...rest
}) {
  const h = size === 'sm' ? 28 : 32;
  const pad = size === 'sm' ? '0 12px' : '0 15px';
  const variants = {
    primary: {
      background: mhColors.primary,
      color: '#fff',
      border: '1px solid ' + mhColors.primary
    },
    sub: {
      background: '#fff',
      color: mhColors.primaryHover,
      border: '1px solid ' + mhColors.primaryHover
    },
    ghost: {
      background: 'transparent',
      color: mhColors.fg2,
      border: '1px solid ' + mhColors.line
    },
    disabled: {
      background: mhColors.bgPage,
      color: mhColors.fg4,
      border: '1px solid ' + mhColors.line,
      cursor: 'not-allowed'
    }
  };
  const s = disabled ? variants.disabled : variants[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: disabled ? undefined : onClick,
    style: {
      display: 'inflex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: h,
      padding: pad,
      borderRadius: 6,
      font: '500 14px/1 var(--mh-font)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      ...s,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children);
}

// ─── Input ─────────────────────────────────────────────────────
function Input({
  placeholder,
  value,
  onChange,
  error,
  disabled,
  style,
  icon,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const base = {
    height: 32,
    padding: '0 12px',
    borderRadius: 6,
    background: '#fff',
    border: '1px solid ' + mhColors.line,
    font: '400 14px/1 var(--mh-font)',
    color: mhColors.fg,
    outline: 'none',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6
  };
  if (disabled) Object.assign(base, {
    background: mhColors.bgPage,
    color: mhColors.fg4
  });
  if (error) Object.assign(base, {
    borderColor: mhColors.danger
  });
  if (focus) Object.assign(base, {
    borderColor: mhColors.primary,
    boxShadow: '0 0 0 2px rgba(22,119,255,0.15)'
  });
  return /*#__PURE__*/React.createElement("label", {
    style: {
      ...base,
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.fg4
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    value: value ?? '',
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onChange: e => onChange && onChange(e.target.value),
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      font: 'inherit',
      color: 'inherit'
    }
  }, rest)));
}

// ─── Select (simple) ───────────────────────────────────────────
function Select({
  value,
  options = [],
  placeholder = '선택',
  onChange,
  width = 120
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      fontFamily: 'var(--mh-font)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    style: {
      height: 32,
      padding: '0 10px',
      borderRadius: 6,
      background: '#fff',
      border: '1px solid ' + (open ? mhColors.primary : mhColors.line),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      font: '400 14px/1 var(--mh-font)',
      color: value ? mhColors.fg : mhColors.fg4
    }
  }, /*#__PURE__*/React.createElement("span", null, value ?? placeholder), /*#__PURE__*/React.createElement("span", {
    style: {
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: `5px solid ${open ? mhColors.primary : mhColors.fg4}`
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 36,
      left: 0,
      right: 0,
      zIndex: 20,
      background: '#fff',
      border: '1px solid ' + mhColors.line,
      borderRadius: 6,
      boxShadow: '0 6px 16px rgba(0,35,11,0.2)',
      padding: '4px 0',
      maxHeight: 280,
      overflow: 'auto'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("div", {
    key: o,
    onClick: () => {
      onChange && onChange(o);
      setOpen(false);
    },
    style: {
      padding: '8px 12px',
      font: '400 14px/1 var(--mh-font)',
      color: o === value ? mhColors.primary : mhColors.fg,
      background: o === value ? mhColors.primary50 : 'transparent',
      fontWeight: o === value ? 600 : 400,
      cursor: 'pointer'
    }
  }, o))));
}

// ─── Checkbox ──────────────────────────────────────────────────
function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  half
}) {
  const on = checked || half;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? mhColors.fg4 : mhColors.fg,
      font: 'var(--mh-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 3,
      border: '1px solid ' + (disabled ? mhColors.line : on ? mhColors.primary : mhColors.fg4),
      background: disabled ? mhColors.bgPage : on ? mhColors.primary : '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 11,
      fontWeight: 700
    }
  }, half ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 2,
      background: '#fff',
      borderRadius: 1
    }
  }) : checked ? '✓' : ''), label && /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      display: 'none'
    },
    disabled: disabled
  }));
}

// ─── Switch / Toggle ───────────────────────────────────────────
function Toggle({
  on,
  onChange,
  label,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      color: mhColors.fg,
      font: 'var(--mh-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!on),
    style: {
      width: 28,
      height: 16,
      borderRadius: 999,
      background: on ? mhColors.primary : mhColors.line,
      position: 'relative',
      transition: 'background .15s ease-out'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 14 : 2,
      width: 12,
      height: 12,
      background: '#fff',
      borderRadius: '50%',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      transition: 'left .15s ease-out'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}

// ─── Tag / Chip ────────────────────────────────────────────────
function Tag({
  color = 'blue',
  children,
  removable,
  onRemove
}) {
  const tones = {
    blue: {
      bg: mhColors.primary50,
      fg: mhColors.primary,
      bd: 'rgba(22,119,255,0.3)'
    },
    red: {
      bg: mhColors.dangerBg,
      fg: mhColors.dangerStrong,
      bd: mhColors.dangerBorder
    },
    green: {
      bg: mhColors.successBg,
      fg: mhColors.success,
      bd: mhColors.successBorder
    },
    orange: {
      bg: '#FFF7E6',
      fg: mhColors.warning,
      bd: mhColors.warningBorder
    },
    gray: {
      bg: mhColors.bgPage,
      fg: mhColors.fg2,
      bd: mhColors.line
    },
    teal: {
      bg: '#E6FFFB',
      fg: '#359795',
      bd: 'rgba(53,151,149,0.35)'
    }
  };
  const t = tones[color] || tones.blue;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 20,
      padding: '0 8px',
      borderRadius: 4,
      font: '500 12px/1 var(--mh-font)',
      background: t.bg,
      color: t.fg,
      border: '1px solid ' + t.bd
    }
  }, children, removable && /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      cursor: 'pointer',
      marginLeft: 2
    }
  }, "\xD7"));
}

// ─── Score chip (correct-rate) ─────────────────────────────────
function ScoreChip({
  value
}) {
  const color = value >= 80 ? {
    fg: '#20AF66',
    bd: '#B1E266'
  } : value >= 50 ? {
    fg: mhColors.warning,
    bd: mhColors.warningBorder
  } : {
    fg: mhColors.danger,
    bd: mhColors.dangerBorder
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      height: 22,
      padding: '0 8px',
      borderRadius: 4,
      border: '1px solid ' + color.bd,
      color: color.fg,
      font: '700 12px/1 var(--mh-font)',
      alignItems: 'center'
    }
  }, value);
}

// ─── Pagination ────────────────────────────────────────────────
function Pagination({
  page = 1,
  total = 3,
  onChange
}) {
  const pages = Array.from({
    length: total
  }, (_, i) => i + 1);
  const Item = ({
    n,
    active,
    arrow,
    disabled,
    onClick,
    children
  }) => /*#__PURE__*/React.createElement("span", {
    onClick: disabled ? undefined : onClick,
    style: {
      width: 32,
      height: 32,
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '700 14px/1 var(--mh-font)',
      cursor: disabled ? 'default' : 'pointer',
      background: active ? mhColors.primary50 : 'transparent',
      border: active ? '1px solid ' + mhColors.primary : '1px solid transparent',
      color: active ? mhColors.primary : disabled ? mhColors.line : mhColors.fg
    }
  }, children ?? n);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Item, {
    disabled: page === 1,
    onClick: () => onChange && onChange(page - 1),
    arrow: true
  }, "\u2039"), pages.map(n => /*#__PURE__*/React.createElement(Item, {
    key: n,
    n: n,
    active: n === page,
    onClick: () => onChange && onChange(n)
  })), /*#__PURE__*/React.createElement(Item, {
    disabled: page === total,
    onClick: () => onChange && onChange(page + 1),
    arrow: true
  }, "\u203A"));
}

// ─── Tooltip (hover) ───────────────────────────────────────────
function Tooltip({
  label,
  children,
  direction = 'top'
}) {
  const [show, setShow] = useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, -6px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, 6px)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translate(6px, -50%)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translate(-6px, -50%)'
    }
  }[direction];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...pos,
      background: mhColors.fg,
      color: '#fff',
      padding: '6px 10px',
      borderRadius: 4,
      font: '400 12px/1 var(--mh-font)',
      whiteSpace: 'nowrap',
      zIndex: 50
    }
  }, label));
}

// ─── Card ──────────────────────────────────────────────────────
function Card({
  children,
  style,
  padding = 20
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid ' + mhColors.line,
      borderRadius: 10,
      padding,
      ...style
    }
  }, children);
}
Object.assign(window, {
  mhColors,
  Button,
  Input,
  Select,
  Checkbox,
  Toggle,
  Tag,
  ScoreChip,
  Pagination,
  Tooltip,
  Card
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_dashboard/Components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_dashboard/LearningStatus.jsx
try { (() => {
// LearningStatus — 학습현황 unit-type grid
function LearningStatus() {
  const tabs = ['학생', '학습', '레벨업', '출력', '교재', '과제', '주간 클리닉', '일일학습', '유형분석', '서술형', '고난도', '단원분석', '유형이력', '문자', '설정'];
  const [tab, setTab] = useState('학습');
  const units = [{
    code: '1.1.1 소수와 합성수',
    types: [{
      n: 1,
      pct: 83,
      count: '2명 제출'
    }, {
      n: 2,
      pct: 100,
      count: '2명 제출'
    }, {
      n: 3,
      pct: 83,
      count: '2명 제출'
    }, {
      n: 4,
      pct: 66,
      count: '2명 제출'
    }, {
      n: 5,
      pct: 66,
      count: '2명 제출'
    }, {
      n: 6,
      pct: 83,
      count: '2명 제출'
    }]
  }, {
    code: '1.1.2 거듭제곱',
    types: [{
      n: 1,
      pct: 49,
      count: '2명 제출'
    }]
  }, {
    code: '1.1.3 소인수분해',
    types: [{
      n: 1,
      pct: 100,
      count: '2명 제출'
    }, {
      n: 2,
      pct: 83,
      count: '2명 제출'
    }, {
      n: 3,
      pct: 66,
      count: '1명 제출'
    }, {
      n: 4,
      pct: 33,
      count: '1명 제출'
    }]
  }];
  const Unit = ({
    type,
    pct,
    count
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 120,
      border: '1px solid ' + mhColors.line,
      borderRadius: 8,
      padding: 10,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px/1 var(--mh-font)',
      color: mhColors.fg
    }
  }, "\uC720\uD615", type), /*#__PURE__*/React.createElement(ScoreChip, {
    value: pct
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1 var(--mh-font)',
      color: mhColors.primary
    }
  }, count));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1 var(--mh-font)',
      color: mhColors.primary
    }
  }, "\u2039 \uC218\uC5C5 \uBAA9\uB85D"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--mh-h1)',
      margin: 0
    }
  }, "\uC911\uB4F1 1-1 (2022\uAC1C\uC815) \uC790\uC774\uC2A4\uD1A0\uB9AC (\uC720\uC0AC)"), /*#__PURE__*/React.createElement(Tag, {
    color: "blue"
  }, "\uC911\uB4F1 1-1 (2022 \uAC1C\uC815)"), /*#__PURE__*/React.createElement(Tag, {
    color: "red"
  }, "\uC18C\uB2E8\uC6D0\uD559\uC2B5"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.fg2,
      fontWeight: 600
    }
  }, "\uC624\uBBFC\uC601 \uC120\uC0DD\uB2D8")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      borderBottom: '1px solid ' + mhColors.line
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: '10px 0',
      cursor: 'pointer',
      color: t === tab ? mhColors.primary : mhColors.fg2,
      font: (t === tab ? 700 : 500) + ' 14px/1 var(--mh-font)',
      borderBottom: t === tab ? '2px solid ' + mhColors.primary : '2px solid transparent'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    color: "blue"
  }, "\uD559\uC0DD 3"), /*#__PURE__*/React.createElement(Button, {
    variant: "sub",
    size: "sm"
  }, "\uBCC0\uACBD"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 20,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    color: "blue"
  }, "1 \uC218\uC640 \uC5F0\uC0B0"), /*#__PURE__*/React.createElement(Tag, {
    color: "gray"
  }, "2 \uBB38\uC790\uC640 \uC2DD"), /*#__PURE__*/React.createElement(Tag, {
    color: "gray"
  }, "3 \uC88C\uD45C\uD3C9\uBA74\uACFC \uADF8\uB798\uD504")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.fg2,
      font: 'var(--mh-body-sm)'
    }
  }, "\uC624\uB2F5\uC720\uC0AC \uBCF4\uAE30"), /*#__PURE__*/React.createElement(Toggle, {
    on: false,
    onChange: () => {}
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, units.map(u => /*#__PURE__*/React.createElement("div", {
    key: u.code
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mh-h3)'
    }
  }, u.code), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "\uC804\uCCB4\uC120\uD0DD")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, u.types.map(t => /*#__PURE__*/React.createElement(Unit, {
    key: t.n,
    type: t.n,
    pct: t.pct,
    count: t.count
  })))))));
}
window.LearningStatus = LearningStatus;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_dashboard/LearningStatus.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_dashboard/SmsCompose.jsx
try { (() => {
// SmsCompose — 문자 보내기 screen
function SmsCompose() {
  const [text, setText] = useState('안녕하세요 학부모님, 오늘 수업 안내드립니다.');
  const [recipients, setRecipients] = useState([{
    id: 1,
    name: '동범Ime'
  }, {
    id: 2,
    name: '민초테스트'
  }]);
  const [mode, setMode] = useState('parent');
  const bytes = new Blob([text]).size;
  const grades = ['전체', '초등학교 1학년', '초등학교 2학년', '초등학교 3학년', '초등학교 4학년', '초등학교 5학년', '초등학교 6학년', '중학교 1학년', '중학교 2학년', '중학교 3학년', '고등학교 1학년', '고등학교 2학년', '고등학교 3학년', '고등학교 졸업생'];
  const [grade, setGrade] = useState('초등학교 1학년');
  const students = [{
    id: 1,
    name: '동범Ime',
    checked: true
  }, {
    id: 2,
    name: '민초테스트',
    checked: true
  }, {
    id: 3,
    name: '이험승테스트'
  }, {
    id: 4,
    name: '학생4'
  }, {
    id: 5,
    name: '학생AE'
  }, {
    id: 6,
    name: '학BB'
  }, {
    id: 7,
    name: '한석봉'
  }, {
    id: 8,
    name: '현승01'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      borderBottom: '1px solid ' + mhColors.line,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0',
      color: mhColors.primary,
      fontWeight: 700,
      borderBottom: '2px solid ' + mhColors.primary
    }
  }, "\u2708 \uBB38\uC790 \uBCF4\uB0B4\uAE30"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0',
      color: mhColors.fg2
    }
  }, "\u2261 \uBCF4\uB0B8 \uB0B4\uC5ED")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '320px 260px 1fr',
      gap: 28,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mh-h4)',
      marginBottom: 8
    }
  }, "\uBB38\uC790 \uB0B4\uC6A9"), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    style: {
      width: '100%',
      height: 240,
      border: '1px solid ' + mhColors.line,
      borderRadius: 6,
      padding: 12,
      font: 'var(--mh-body)',
      color: mhColors.fg,
      resize: 'none',
      outline: 'none',
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--mh-body)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    checked: mode === 'parent',
    onChange: () => setMode('parent')
  }), " \uD559\uBD80\uBAA8"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--mh-body)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    checked: mode === 'student',
    onChange: () => setMode('student')
  }), " \uD559\uC0DD"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: 'var(--mh-body-sm)',
      color: mhColors.fg3
    }
  }, bytes, " / 2000 bytes")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      width: '100%',
      marginTop: 10,
      height: 36
    }
  }, recipients.length, "\uBA85\uC5D0\uAC8C \uBCF4\uB0B4\uAE30"), /*#__PURE__*/React.createElement(Card, {
    padding: 14,
    style: {
      marginTop: 14,
      background: mhColors.bgPage,
      borderColor: mhColors.lineSoft
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mh-body-sm)',
      color: mhColors.fg2,
      lineHeight: '1.6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: mhColors.fg,
      marginBottom: 6
    }
  }, "\u24D8 \uBB38\uC790 \uBC1C\uC1A1 \uC548\uB0B4"), "\xB7 80bytes \uCD08\uACFC \uC2DC MMS\uB85C \uC804\uC1A1\uB418\uBA70 \uB2E8\uBB38(SMS)\uC758 3\uBC30 \uC694\uAE08\uC774 \uCCAD\uAD6C\uB429\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\xB7 \uBC1C\uC1A1\uBC88\uD638\uB294 ", /*#__PURE__*/React.createElement("b", null, "1588-9034"), "\uB85C \uACE0\uC815\uB429\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\xB7 \uC790\uC138\uD55C \uB0B4\uC6A9\uC740 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.primary,
      textDecoration: 'underline'
    }
  }, "\uACF5\uC9C0\uC0AC\uD56D"), "\uC744 \uCC38\uC870\uD574\uC8FC\uC2DC\uAE30 \uBC14\uB78D\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mh-h4)',
      marginBottom: 8
    }
  }, "\uC120\uD0DD\uB41C \uD559\uC0DD ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.primary
    }
  }, recipients.length, "\uBA85")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, recipients.map(r => /*#__PURE__*/React.createElement(Tag, {
    key: r.id,
    color: "blue",
    removable: true,
    onRemove: () => setRecipients(recipients.filter(x => x.id !== r.id))
  }, r.name))), /*#__PURE__*/React.createElement(Button, {
    variant: "sub",
    size: "sm",
    style: {
      marginTop: 14
    }
  }, "\uC804\uCCB4 \uD574\uC81C")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mh-h4)',
      marginBottom: 8
    }
  }, "\uBC1B\uB294 \uD559\uC0DD \uC120\uD0DD"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      borderBottom: '1px solid ' + mhColors.line,
      marginBottom: 12
    }
  }, ['검색', '학년', '반', '그룹'].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      padding: '8px 0',
      color: i === 1 ? mhColors.primary : mhColors.fg2,
      fontWeight: i === 1 ? 700 : 500,
      borderBottom: i === 1 ? '2px solid ' + mhColors.primary : '2px solid transparent',
      cursor: 'pointer',
      font: '14px var(--mh-font)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '170px 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid ' + mhColors.line,
      borderRadius: 6,
      padding: 4,
      background: '#fff',
      maxHeight: 320,
      overflow: 'auto'
    }
  }, grades.map(g => /*#__PURE__*/React.createElement("div", {
    key: g,
    onClick: () => setGrade(g),
    style: {
      padding: '8px 10px',
      borderRadius: 4,
      background: g === grade ? mhColors.primary50 : 'transparent',
      color: g === grade ? mhColors.primary : mhColors.fg2,
      fontWeight: g === grade ? 600 : 500,
      font: '13px/1 var(--mh-font)',
      cursor: 'pointer'
    }
  }, g))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 10,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mh-h4)'
    }
  }, grade), /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.fg4,
      fontSize: 12
    }
  }, "(", recipients.length, "/", students.length, "\uBA85 \uC120\uD0DD)"), /*#__PURE__*/React.createElement(Button, {
    variant: "sub",
    size: "sm",
    style: {
      marginLeft: 'auto'
    }
  }, "\uC804\uCCB4 \uC120\uD0DD")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8
    }
  }, students.map(s => {
    const isOn = recipients.some(r => r.name === s.name);
    return /*#__PURE__*/React.createElement(Checkbox, {
      key: s.id,
      checked: isOn,
      label: s.name,
      onChange: v => v ? setRecipients([...recipients, s]) : setRecipients(recipients.filter(r => r.name !== s.name))
    });
  })))))));
}
window.SmsCompose = SmsCompose;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_dashboard/SmsCompose.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_dashboard/WorksheetList.jsx
try { (() => {
// WorksheetList — the 학습지 table screen
function WorksheetList({
  onOpen
}) {
  const [subject, setSubject] = useState('전체');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('진행중');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState({});
  const rows = [{
    id: 1,
    tag: ['단원', 'blue'],
    name: '1.1.2 분자끼리 나누어떨어지지 않는 분수의 나눗셈',
    meta: '50문항 · 25.02.03 · 김태호 선생님',
    course: '초등 2–2, 초3–1',
    level: 83,
    window: '25.02.03 ~ 02.10',
    student: '추가',
    submit: '1/5명',
    round: '1회차',
    score: '+2'
  }, {
    id: 2,
    tag: ['시범', 'red'],
    name: '[짱 중요한 내신] 공통수학1 (2022개정) p.7',
    meta: '100문항 · 25.02.03 · 김채보 선생님',
    course: '공통수학1 (2022개정) 외 2개',
    level: 66,
    window: '0/20명',
    student: '',
    submit: '0/20명',
    round: '2회차',
    score: '+3'
  }, {
    id: 3,
    tag: ['단원', 'blue'],
    name: '1.1.2 분자끼리 나누어떨어지지 않는 분수의 나눗셈',
    meta: '50문항 · 25.02.03 · 김채보 선생님',
    course: '초등 2–2, 초3–1',
    level: 100,
    window: '1/2명',
    student: '',
    submit: '1/2명',
    round: '',
    score: '92.0점'
  }, {
    id: 4,
    tag: ['단원', 'blue'],
    name: '2024년 10월 고3 교육청 선택 - 기하',
    meta: '100문항 · 25.02.03 · 김해수 선생님',
    course: '기출과정',
    level: 89,
    window: '25.02.03 ~ 02.10',
    student: '',
    submit: '3/20명',
    round: '1회차',
    score: '+2'
  }, {
    id: 5,
    tag: ['단원', 'blue'],
    name: '1.1.2 분자끼리 나누어떨어지지 않는 분수의 나눗셈',
    meta: '50문항 · 25.02.03 · 최대수 선생님',
    course: '초등 2–2',
    level: 66,
    window: '25.02.03 ~ 02.10',
    student: '',
    submit: '12/12명',
    round: '3회차',
    score: ''
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--mh-h1)',
      margin: 0
    }
  }, "\uD559\uC2B5\uC9C0"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onOpen
  }, "+ \uC0C8 ooo \uB9CC\uB4E4\uAE30"))), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      background: '#fff',
      border: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      borderBottom: '1px solid ' + mhColors.lineSoft
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: subject,
    options: ['전체', '초등', '중등', '고등'],
    onChange: setSubject,
    width: 80
  }), /*#__PURE__*/React.createElement(Input, {
    icon: /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD0D"),
    placeholder: "\uAC80\uC0C9",
    value: search,
    onChange: setSearch,
    style: {
      width: 180
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "sub",
    size: "sm"
  }, "\uD544\uD130 \uC120\uD0DD \u2261"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: status,
    options: ['진행중', '완료', '전체'],
    onChange: setStatus,
    width: 90
  }), /*#__PURE__*/React.createElement(Select, {
    value: "\uCD5C\uADFC\uC21C",
    options: ['최근순', '이름순', '점수순'],
    onChange: () => {},
    width: 100
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 4px'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      font: 'var(--mh-body)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      color: mhColors.fg2,
      borderBottom: '1px solid ' + mhColors.line
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, null)), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: 12,
      fontWeight: 600
    }
  }, "\uACFC\uC815"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: 12,
      fontWeight: 600
    }
  }, "\uD559\uC2B5\uC9C0\uBA85"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 90,
      padding: 12,
      fontWeight: 600
    }
  }, "\uB09C\uC774\uB3C4"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 80,
      padding: 12,
      fontWeight: 600
    }
  }, "\uD559\uC0DD"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 80,
      padding: 12,
      fontWeight: 600
    }
  }, "\uC81C\uCD9C"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 60,
      padding: 12,
      fontWeight: 600
    }
  }, "\uD68C\uCC28"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 100,
      padding: 12
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    style: {
      borderBottom: '1px solid ' + mhColors.lineSoft
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: !!selected[r.id],
    onChange: v => setSelected({
      ...selected,
      [r.id]: v
    })
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12,
      color: mhColors.fg3,
      fontSize: 13
    }
  }, r.course), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    color: r.tag[1]
  }, r.tag[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: mhColors.fg,
      fontWeight: 500
    }
  }, r.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--mh-caption)',
      color: mhColors.fg4,
      marginTop: 4
    }
  }, r.meta)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(ScoreChip, {
    value: r.level
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12,
      color: mhColors.fg2,
      fontSize: 13
    }
  }, r.student), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12,
      color: mhColors.primary,
      fontSize: 13
    }
  }, r.submit), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12,
      color: mhColors.fg2,
      fontSize: 13
    }
  }, r.round), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "sub",
    size: "sm"
  }, "\uCD9C\uB825\uD558\uAE30"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    total: 3,
    onChange: setPage
  }))));
}
window.WorksheetList = WorksheetList;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_dashboard/WorksheetList.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ButtonGroup = __ds_scope.ButtonGroup;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.OnOffButton = __ds_scope.OnOffButton;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.ScoreChip = __ds_scope.ScoreChip;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.Tooltip = __ds_scope.Tooltip;

})();
