const spinnerStyle = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  border: '3px solid rgba(0,0,0,0.08)',
  borderTopColor: '#667eea',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const Spinner = ({ label }) => (
  <div style={containerStyle}>
    <span style={spinnerStyle} aria-hidden="true" />
    {label ? (
      <span style={{ marginLeft: 10, fontSize: 14, color: '#4a5568' }}>
        {label}
      </span>
    ) : null}
    <style>
      {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
    </style>
  </div>
);

export default Spinner;


