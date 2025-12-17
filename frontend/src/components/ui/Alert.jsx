const baseStyle = {
  padding: '12px 14px',
  borderRadius: 10,
  fontSize: 14,
  lineHeight: 1.5,
  borderLeft: '4px solid',
  marginBottom: 16,
};

const variants = {
  error: { background: '#fff5f5', color: '#c53030', borderColor: '#c53030' },
  success: { background: '#f0fff4', color: '#2f855a', borderColor: '#2f855a' },
  info: { background: '#ebf8ff', color: '#2b6cb0', borderColor: '#2b6cb0' },
};

const Alert = ({ type = 'info', children }) => {
  const style = { ...baseStyle, ...variants[type] };
  return <div style={style}>{children}</div>;
};

export default Alert;


