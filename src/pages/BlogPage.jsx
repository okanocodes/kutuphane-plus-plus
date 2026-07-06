import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/blogSlice";
import { fetchBooks } from "../store/bookSlice";
import BlogCard from "../components/blog/BlogCard";
import { slugify } from "../utils/slugify";

export const BlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { blogs, status } = useSelector((state) => state.blogs);
  const { books } = useSelector((state) => state.books);

  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'news' | 'recommendation' | 'new_release'

  const selectedBlog = useMemo(() => {
    if (!slug || !blogs.length) return null;
    return blogs.find((b) => slugify(b.title) === slug);
  }, [slug, blogs]);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBlog) {
      document.title = `${selectedBlog.title} — Kütüphane++`;
    } else {
      document.title = "Kütüphane++ — Blog";
    }
  }, [selectedBlog]);

  // Filter blogs in the list
  const filteredBlogs = useMemo(() => {
    if (activeCategory === "all") return blogs;
    return blogs.filter((b) => b.category === activeCategory);
  }, [blogs, activeCategory]);

  // Recommended books for recommendation posts
  const recommendedBooks = useMemo(() => {
    if (!selectedBlog || selectedBlog.category !== "recommendation") return [];
    return books.slice(0, 2);
  }, [selectedBlog, books]);

  const categoryLabels = {
    news: "Haberler",
    recommendation: "Kitap Önerisi",
    new_release: "Yeni Kitaplar",
  };

  const categoryColorClasses = {
    news: "bg-vivid-purple/20 text-tertiary-fixed",
    recommendation: "bg-ember-orange/20 text-ember-orange",
    new_release: "bg-success/20 text-success",
  };

  if (selectedBlog) {
    // Detailed Blog view
    return (
      <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-md space-y-lg text-left">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-xs text-on-surface-variant hover:text-ember-orange transition-all font-label-sm text-label-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>{" "}
          Listeye Geri Dön
        </button>

        <div className="space-y-md">
          {/* Cover image banner */}
          <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-highest">
            <img
              src={selectedBlog.imageUrl}
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-sm items-center text-xs text-on-surface-variant font-metadata-mono font-medium">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${categoryColorClasses[selectedBlog.category]}`}
            >
              {categoryLabels[selectedBlog.category]}
            </span>
            <span>Tarih: {selectedBlog.date}</span>
            <span>Yazar: {selectedBlog.author}</span>
          </div>

          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface leading-tight">
            {selectedBlog.title}
          </h1>

          <div className="border-t border-outline-variant/30 pt-md text-base leading-relaxed text-on-surface-variant space-y-md">
            {selectedBlog.content.split("\n").map((para, index) => (
              <p key={index}>{para}</p>
            ))}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              volutpat, sapien vel hendrerit vehicula, ex lorem viverra ante, id
              pretium nulla purus feugiat leo. Integer elementum, libero sit
              amet eleifend pretium, sem quam vulputate massa, vitae vestibulum
              erat tellus in quam. Fusce tristique lacus ipsum, vel tincidunt
              sem accumsan congue.
            </p>
            <p>
              Nullam pellentesque elementum arcu vel tempor. Suspendisse
              pulvinar erat a massa cursus imperdiet. Sed viverra imperdiet ex
              in tempus. Ut vel feugiat elit, at sodales ligula. Class aptent
              taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos.
            </p>
          </div>

          {/* Book recommendation section */}
          {recommendedBooks.length > 0 && (
            <div className="pt-lg border-t border-outline-variant/30 space-y-md">
              <h3 className="font-headline-h3 text-xl font-bold text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-ember-orange">
                  recommend
                </span>
                Önerilen Kitaplar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {recommendedBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="glass-card p-md rounded-xl border border-outline-variant flex items-center justify-between hover:border-vivid-purple transition-all duration-300 cursor-pointer"
                  >
                    <div className="space-y-xs truncate">
                      <h4 className="font-bold text-sm text-on-surface truncate">
                        {book.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-metadata-mono">
                        K++ Kütüphane
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-ember-orange">
                      arrow_forward_ios
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="space-y-xs text-left">
          <h1 className="font-display-lg text-primary text-3xl font-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-ember-orange">
              rss_feed
            </span>
            Blog ve Haberler
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Kütüphanemizden resmi duyurular, haberler, etkinlik özetleri ve
            kitap tavsiyeleri.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-surface-container border border-outline-variant p-1 rounded-xl w-fit self-start md:self-auto">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-vivid-purple text-white shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setActiveCategory("news")}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              activeCategory === "news"
                ? "bg-vivid-purple text-white shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Haberler
          </button>
          <button
            onClick={() => setActiveCategory("recommendation")}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              activeCategory === "recommendation"
                ? "bg-vivid-purple text-white shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Kitap Önerileri
          </button>
          <button
            onClick={() => setActiveCategory("new_release")}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              activeCategory === "new_release"
                ? "bg-vivid-purple text-white shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Yeni Kitaplar
          </button>
        </div>
      </div>

      {/* Grid of posts */}
      {status === "loading" ? (
        <div className="text-center py-20">
          <p className="text-on-surface-variant font-body-md">
            Blog yazıları yükleniyor...
          </p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="glass-card p-xl rounded-xl border border-outline-variant text-center">
          <span className="material-symbols-outlined text-outline text-5xl mb-sm">
            rss_feed
          </span>
          <p className="font-body-lg text-on-surface-variant">
            Henüz bu kategoride bir yazı yayımlanmamış.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onClick={() => navigate(`/blog/${slugify(blog.title)}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
