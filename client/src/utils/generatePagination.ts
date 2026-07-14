export const generatePagination = (currentPage: number, totalPages: number) => {
  const pagination = [];

  if (totalPages <= 4) {
    // اگر تعداد کل صفحات کمتر یا مساوی 4 باشد، همه صفحات را نمایش بده
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(i);
    }
  } else {
    // اضافه کردن صفحه اول
    if (currentPage > 3) {
      pagination.push(1);
      if (currentPage > 4) pagination.push("...");
    }

    // اضافه کردن سه عدد وسط
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pagination.push(i);
    }

    // اضافه کردن صفحه آخر
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pagination.push("...");
      pagination.push(totalPages);
    }
  }

  return pagination;
};
