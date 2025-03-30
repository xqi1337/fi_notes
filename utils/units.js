export const DATA_UNITS = {
    // Dezimal (SI)
    B: { name: 'Byte', factor: 1, type: 'decimal' },
    kB: { name: 'Kilobyte (kB)', factor: 1e3, type: 'decimal' },
    MB: { name: 'Megabyte (MB)', factor: 1e6, type: 'decimal' },
    GB: { name: 'Gigabyte (GB)', factor: 1e9, type: 'decimal' },
    TB: { name: 'Terabyte (TB)', factor: 1e12, type: 'decimal' },
  
    // Binär (IEC)
    KiB: { name: 'Kibibyte (KiB)', factor: 1024, type: 'binary' },
    MiB: { name: 'Mebibyte (MiB)', factor: 1024 ** 2, type: 'binary' },
    GiB: { name: 'Gibibyte (GiB)', factor: 1024 ** 3, type: 'binary' },
    TiB: { name: 'Tebibyte (TiB)', factor: 1024 ** 4, type: 'binary' },
  }