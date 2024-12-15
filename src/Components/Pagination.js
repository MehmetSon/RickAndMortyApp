import React from 'react';

// Pagination component'i, sayfalama işlemini yönetir
const Pagination = ({ charactersPerPage, totalCharacters, paginate, currentPage }) => {
  const pageNumbers = [];   // Sayfa numaralarını depolayacak boş bir dizi oluşturuluyor

  // Sayfa numaralarını oluştur
  for (let i = 1; i <= Math.ceil(totalCharacters / charactersPerPage); i++) {
    pageNumbers.push(i);    // Toplam karakter sayısını, sayfa başına düşen karakter sayısına bölüp yuvarlayarak sayfa numaralarını oluşturuyor
  }

  return (
    <nav> {/* Sayfalama için nav etiketi */}
      <ul className="pagination"> {/* Sayfalama için liste oluşturuluyor */}
        {pageNumbers.map((number) => (  // pageNumbers dizisindeki her sayfa numarasını al
          <li key={number} className="page-item"> {/* Her sayfa numarasını liste elemanı olarak ekle */}
            <a
              href="#!" // Link tıklandığında sayfanın yenilenmemesi için #! kullanıyoruz
              onClick={() => paginate(number)}  // Tıklanan sayfa numarasına göre paginate fonksiyonunu çağırıyoruz
              className={`page-link ${currentPage === number ? 'active' : ''}`} // Eğer şu anki sayfa, tıklanan sayfa ile eşleşiyorsa 'active' sınıfı ekleniyor
            >
              {number}  {/* Sayfa numarasını ekrana bas */}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;


