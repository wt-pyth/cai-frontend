const genMaturity = (data) => {
  const percent = (data.comp_count || 0) / (data.ccount || 1);

  if (percent < 0.5) {
    return ['New', '#ff4d4f'];
  }
  if (percent >= 0.5 && percent < 0.79) {
    return ['Repeatable', '#ffec3d'];
  }
  return ['Defined', '#52c41a'];
};

/*
  #ff4d4f
  #faad14
  #ffec3d
  #d3f261
  #52c41a */

export default genMaturity;
