"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { normalizeImageUrl } from "@/context/ProductContext";
import FadingVideo from "./FadingVideo";
import { ArrowUpRight } from "./icons";
import styles from "./BrandStory.module.css";

/**
 * Cinematic brand-story block. Media comes from site settings
 * (config.brandStory) so it is swappable from the admin with a Drive link.
 * Copy stays in the translation/content system.
 */
export default function BrandStory() {
  const { t, lang } = useLang();
  const { config } = useConfig();
  const cfg = config.brandStory || {};
  const poster = cfg.image ? normalizeImageUrl(cfg.image) : null;
  const video = cfg.video ? normalizeImageUrl(cfg.video) : "";

  return (
    <section className={styles.wrap} aria-labelledby="story-title">
      <div className={styles.media} aria-hidden="true">
        <FadingVideo src={video} poster={poster} alt="" fit="cover" className={styles.mediaInner} />
        <div className={styles.scrim} />
      </div>

      <div className={styles.inner}>
        <div className={`glass ${styles.panel}`}>
          <p className="eyebrow">{t("story.eyebrow")}</p>
          <h2 id="story-title" className={`editorial ${styles.title}`}>
            {t("story.title")}
          </h2>
          <p className={styles.body}>{t("story.body")}</p>
          <Link href="/about" className={styles.cta}>
            <span>{t("nav.about")}</span>
            <ArrowUpRight size={16} className={styles.ctaArrow} />
          </Link>
        </div>
      </div>
    </section>
  );
}
