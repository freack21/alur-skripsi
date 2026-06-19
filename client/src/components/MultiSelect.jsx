import { useState, useRef, useEffect } from 'react';

export default function MultiSelect({ options, selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const toggleOption = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(val => val !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeOption = (e, id) => {
    e.stopPropagation();
    onChange(selected.filter(val => val !== id));
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="form-control" 
        style={{ 
          minHeight: '38px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '6px', 
          padding: '6px 8px', 
          cursor: 'pointer', 
          alignItems: 'center',
          backgroundColor: '#fff'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span style={{ color: '#6c757d', padding: '2px', fontSize: '13px' }}>
            {placeholder || 'Pilih opsi...'}
          </span>
        )}
        {selected.map(id => {
          const opt = options.find(o => o.id === id);
          if (!opt) return null;
          return (
            <span 
              key={id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                backgroundColor: '#e9ecef', 
                color: '#495057', 
                border: '1px solid #ced4da',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {opt.nama}
              <span 
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', lineHeight: 1 }} 
                onClick={(e) => removeOption(e, id)}
              >
                ×
              </span>
            </span>
          );
        })}
      </div>
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          backgroundColor: 'white', 
          border: '1px solid #ced4da', 
          borderTop: 'none', 
          zIndex: 100, 
          maxHeight: '200px', 
          overflowY: 'auto', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px'
        }}>
          {options.map(opt => (
            <div 
              key={opt.id} 
              style={{ 
                padding: '8px 12px', 
                cursor: 'pointer', 
                borderBottom: '1px solid #f8f9fa', 
                backgroundColor: selected.includes(opt.id) ? '#f8f9fa' : 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
              onClick={() => toggleOption(opt.id)}
            >
              <input 
                type="checkbox" 
                checked={selected.includes(opt.id)} 
                readOnly 
                style={{ cursor: 'pointer', width: '16px', height: '16px' }} 
              />
              <span style={{ fontSize: '13px', color: '#495057' }}>{opt.nama}</span>
            </div>
          ))}
          {options.length === 0 && (
            <div style={{ padding: '8px 12px', color: '#6c757d', fontSize: '13px', textAlign: 'center' }}>
              Tidak ada pilihan tersedia
            </div>
          )}
        </div>
      )}
    </div>
  );
}
