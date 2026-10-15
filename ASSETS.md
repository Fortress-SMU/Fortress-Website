# Asset provenance

All raster assets were copied byte-for-byte from existing local files on 2026-10-15. No new image generation or source-image editing was performed.

| Site asset | Existing source | SHA-256 |
|---|---|---|
| `dist/assets/logo-en.png` | `Steam Images/Final_2026-10-11/logos/the_sky_breaker_brush_final_english.png` | `f496600206f873d1fc86a269516d61a3350d1ea8a90c2c030280c67fd6c1853e` |
| `dist/assets/logo-ko.png` | `Steam Images/Final_2026-10-11/logos/library_logo_final_koreana.png` | `22055a91ddd96959e22fc77f1075b1ff04cdc49bb0620fc51f40e12c81bb8a29` |
| `dist/assets/key-art.png` | `Steam Images/Final_2026-10-11/source_originals/library_hero_panorama_v01.png` | `b31a9756c2e58dbb3354818e8337de8174a01e715f681e3633a435d8ef363721` |
| `dist/assets/steam-logo.png` | Existing SteamCMD `siteserverui/images/SteamLogo.png` | `a9f90229482199ee37892fdb5f1097d91e50ee1545d25a7a8456fe097a9b85b1` |

The first three paths are relative to the existing `C:/UnrealEngine/Perforce` workspace. Their sources remain unchanged. The small Steam icon is from the existing SteamCMD client under the game's `Saved/SteamReleasePrep_20261010/BuildUpload_0524` folder. Steam and the Steam logo are trademarks of Valve Corporation.

`dist/assets/favicon.svg` and the decorative line icons were authored as simple SVG markup for this draft. Placeholder portraits do not depict actual team members or confirmed game characters. The panoramic art is a pre-existing marketing illustration, not a screenshot or trailer still.

## Fonts added for the mythic design revision

- `dist/assets/fonts/PretendardVariable.woff2`: unmodified [Pretendard v1.3.9](https://github.com/orioncactus/pretendard/tree/v1.3.9/packages/pretendard/dist/web/variable/woff2), by Kil Hyung-jin. Its original SIL Open Font License is included as `Pretendard-LICENSE.txt`.
- `dist/assets/fonts/Cinzel-Variable.ttf`: unmodified [Cinzel from Google Fonts](https://github.com/google/fonts/tree/main/ofl/cinzel). Its original SIL Open Font License is included as `Cinzel-OFL.txt`.
- Both fonts are served locally. No external font requests or new raster artwork were introduced. The celestial rings and ambient particles are CSS/SVG decoration; team cards now use names, roles, and GitHub links instead of portrait placeholders.
