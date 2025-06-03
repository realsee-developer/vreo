/**
 * @fileoverview 资源预加载器
 *
 * 提供资源预加载功能，支持通过 XMLHttpRequest 下载资源并转换为 Blob 对象。
 */
/**
 * 预加载器工具类
 *
 * 提供各种资源预加载的方法，主要用于提前下载和缓存媒体文件。
 *
 * @namespace Preloader
 */
export declare const Preloader: {
    /**
     * 通过 XMLHttpRequest 下载文件并返回 Blob 对象
     *
     * 使用 XHR 请求下载指定 URL 的资源，并将其转换为 Blob 对象。
     * 支持超时处理和错误处理。
     *
     * @param url - 要下载的资源 URL
     * @returns Promise<Blob> - 返回包含文件数据的 Blob 对象
     *
     * @throws {Error} 当请求超时时抛出 'timeout' 错误
     * @throws {Error} 当 HTTP 状态码不是 200 或 0 时抛出状态码错误
     *
     * @example
     * ```typescript
     * // 下载图片文件
     * Preloader.blob('https://example.com/image.jpg')
     *   .then(blob => {
     *     const url = URL.createObjectURL(blob);
     *     const img = new Image();
     *     img.src = url;
     *     document.body.appendChild(img);
     *   })
     *   .catch(error => {
     *     console.error('下载失败:', error.message);
     *   });
     *
     * // 下载视频文件
     * try {
     *   const videoBlob = await Preloader.blob('https://example.com/video.mp4');
     *   const videoUrl = URL.createObjectURL(videoBlob);
     *   const video = document.createElement('video');
     *   video.src = videoUrl;
     * } catch (error) {
     *   console.error('视频下载失败:', error);
     * }
     * ```
     */
    blob: (url: string) => Promise<Blob>;
};
