import { useState } from "react";

const modalSections = [
  {
    id: "privacy",
    title: "Chính sách bảo mật",
    content: (
      <ol className="text-lg text-gray-700 list-decimal list-inside font-bold w-full">
        <li>
          Chúng mình là ai?
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Chúng mình là bộ ba sinh viên đến từ nhóm 3 của lớp ANTN2023.
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Địa chỉ website của chúng mình là: mangadak.onrender.com
            </li>
          </ul>
        </li>
        <li>
          Bình luận
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Khi khách truy cập để lại bình luận trên trang web, chúng tôi thu thập dữ liệu được hiển thị trong biểu mẫu bình luận và cũng là địa chỉ IP của người truy cập và chuỗi user agent của người dùng trình duyệt để giúp phát hiện bình luận rác.
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Một chuỗi ẩn danh được tạo từ địa chỉ email của bạn (còn được gọi là hash) có thể được cung cấp cho dịch vụ Gravatar để xem bạn có đang sử dụng nó hay không. Sau khi chấp nhận bình luận của bạn, ảnh tiểu sử của bạn được hiển thị công khai trong ngữ cảnh bình luận của bạn.
            </li>
          </ul>
        </li>
        <li>
          Cookie
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Nếu bạn viết bình luận trong website, bạn có thể cung cấp cần nhập tên, email địa chỉ website trong cookie. Các thông tin này nhằm giúp bạn không cần nhập thông tin nhiều lần khi viết bình luận khác. Cookie này sẽ được lưu giữ trong một thời gian nhất định.
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Nếu bạn vào trang đăng nhập, chúng tôi sẽ thiết lập một cookie tạm thời để xác định nếu trình duyệt cho phép sử dụng cookie. Cookie này không bao gồm thông tin cá nhân và sẽ được gỡ bỏ khi bạn đóng trình duyệt.
            </li>
          </ul>
        </li>
        <li>
          Các quyền nào của bạn với dữ liệu của mình
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Nếu bạn có tài khoản trên trang web này hoặc đã để lại nhận xét, bạn có thể yêu cầu nhận tệp xuất dữ liệu cá nhân mà chúng tôi lưu giữ về bạn, bao gồm mọi dữ liệu bạn đã cung cấp cho chúng tôi. Bạn cũng có thể yêu cầu chúng tôi xóa mọi dữ liệu cá nhân mà chúng tôi lưu giữ về bạn. Điều này không bao gồm bất kỳ dữ liệu nào chúng tôi có nghĩa vụ giữ cho các mục đích hành chính, pháp lý hoặc bảo mật.
            </li>
          </ul>
        </li>
        <li>
          Chia sẻ thông tin với bên thứ ba
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Chúng tôi cam kết không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào trừ khi có yêu cầu từ cơ quan pháp luật hoặc chính phủ theo quy định pháp luật.
            </li>
          </ul>
        </li>
      </ol>
    ),
  },
  {
    id: "terms",
    title: "Điều khoản dịch vụ",
    content: (
      <ol className="text-lg text-gray-700 list-decimal list-inside font-bold">
        <li>
          Sử dụng dịch vụ
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Bạn cam kết sử dụng website và nội dung truyện tranh đúng mục đích cá nhân, không sử dụng cho mục đích thương mại hay bất hợp pháp
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Bạn không được phép sao chép, phân phối, chỉnh sửa hoặc tái sử dụng nội dung trên website khi chưa được sự cho phép rõ ràng từ mangadak.onrender.com
            </li>
          </ul>
        </li>
        <li>
          Tài khoản người dùng
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Bạn có thể cần đăng ký tài khoản để truy cập một số tính năng đặc biệt.
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu.
            </li>
          </ul>
        </li>
        <li>
          Nội dung do người dùng cung cấp
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Bạn có thể gửi bình luận, đánh giá hoặc nội dung khác theo quy định của website.
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Bạn cam kết không đăng tải nội dung vi phạm pháp luật, gây ảnh hưởng đến người khác, hoặc vi phạm quyền sở hữu trí tuệ.
            </li>
          </ul>
        </li>
        <li>
          Thay đổi điều khoản
          <ul className="list-inside font-normal" style={{ listStyleType: 'none', paddingLeft: '1em' }}>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Mangadakh.orender.com có quyền sửa đổi, bổ sung điều khoản dịch vụ bất cứ lúc nào mà không cần báo trước.
            </li>
            <li style={{ position: 'relative', paddingLeft: '1.2em' }}>
              <span style={{ position: 'absolute', left: 0 }}>-</span>
              Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa bạn chấp nhận các thay đổi đó.
            </li>
          </ul>
        </li>
      </ol>
    ),
  },
  {
    id: "support",
    title: "Liên hệ hỗ trợ",
    content: (
      <p className="text-lg text-gray-700">
        Nếu bạn cần hỗ trợ, vui lòng liên hệ qua email: mangadakh@gmail.com hoặc hotline: 1900 123 456
      </p>
    ),
  },
];

function Modal({ sectionId, onClose }: { sectionId: string; onClose: () => void }) {
  // Scroll to section after modal opens
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);

  return (
    <div className="fixed inset-0 bg-orange-900 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 relative text-black break-normal">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        {modalSections.map((section) => (
          <div id={section.id} className="mb-6" key={section.id}>
            <h2 className="text-2xl font-bold text-orange-800 mb-2">{section.title}</h2>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
}

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);

  const handleOpenModal = (sectionId: string) => {
    setShowModal(true);
    setScrollTargetId(sectionId);
  };

  return (
    <>
      <footer className="bg-zinc-900 text-white py-6 mt-auto text-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
          <div className="text-center sm:text-left">
            <p className="font-semibold mb-2">Thông tin</p>
            <ul className="space-y-1">
              {modalSections.map((section) => (
                <li key={section.id}>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handleOpenModal(section.id);
                    }}
                    className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-2">&copy; 2025 Cabbage🥬 Monkey🙊 Unicorn🦄</p>
            <p className="text-gray-400">All rights reserved.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end text-center sm:text-right space-y-2 sm:space-y-0 sm:space-x-4">
            <p className="text-gray-400">Follow us:</p>
            <div className="flex justify-center sm:justify-end space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61576812846699" className="hover:text-blue-400 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.tiktok.com/@cantevenusemyrealname/video/7519089829850647809?is_from_webapp=1&sender_device=pc" className="hover:text-blue-300 transition">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-xs">
          Made with ❤️ by the DAKH team.
        </div>
      </footer>
      {showModal && scrollTargetId && (
        <Modal sectionId={scrollTargetId} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Footer;