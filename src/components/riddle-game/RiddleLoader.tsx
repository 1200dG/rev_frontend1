'use client'
import { RiddleLoaderProps, RiddleApiData, RiddleFileContents, RiddleFiles } from '@/lib/types/common/types';
import { useEffect, useRef, useState } from 'react';
import { getRiddleById } from '@/lib/services/riddleActions';
import Riddle15 from '../riddle-15';
import { addClickableEventByRiddleId } from '@/lib/utils/helpers';

async function fetchRiddleFileContents(files: RiddleFiles[]): Promise<RiddleFileContents> {
  const fileContents: RiddleFileContents = {
    htmlContent: null,
    cssContent: null,
    jsContent: null,
    backgroundSvgUrl: null,
    backgroundPngUrl: null,
    backgroundMp4Url: null,
    mobileSvgUrl: null,
    mobilePngUrl: null,
    mobileMp4Url: null,
  };

  await Promise.all(
    files.map(async (fileObj) => {
      let fileUrl = fileObj.file;

      // if (fileUrl.startsWith('/')) {
      //   const protocol =
      //     envVars.allowedDomain.includes('localhost') ||
      //     envVars.allowedDomain.includes('127.0.0.1')
      //       ? 'http'
      //       : 'https';

      //   fileUrl = `${protocol}://${envVars.allowedDomain}${fileUrl}`;
      // }

      if (fileUrl.startsWith('/')) {
        fileUrl = `http://127.0.0.1:8000${fileUrl}`
      }

      const cleanUrl = getCleanUrl(fileUrl);

      if (cleanUrl.endsWith('.mp4')) {
        if (cleanUrl.includes('mobile'))
          fileContents.mobileMp4Url = fileUrl
        else
          fileContents.backgroundMp4Url = fileUrl;
        return;
      }

      if (cleanUrl.endsWith('.png')) {
        if (cleanUrl.includes('mobile')) {
          (fileContents.mobilePngUrl = fileUrl)
        }
        else {
          (fileContents.backgroundPngUrl = fileUrl);
        }
        return;
      }

      if (cleanUrl.endsWith('.svg')) {
        if (cleanUrl.includes('mobile')) {
          fileContents.mobileSvgUrl = fileUrl;
        }
        else fileContents.backgroundSvgUrl = fileUrl;
        return;
      }

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);
      const text = await response.text();

      if (cleanUrl.endsWith('.html')) fileContents.htmlContent = text;
      if (cleanUrl.endsWith('.css')) fileContents.cssContent = text;
      if (cleanUrl.endsWith('.js')) fileContents.jsContent = text;
    })
  );
  return fileContents;
}

function useWindowWidth() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function getBackgroundForScreen(riddleFiles: RiddleFileContents, width: number): string | null {
  const isMobile = width < 640;

  if (isMobile) {
    return riddleFiles.mobileMp4Url ?? riddleFiles.mobilePngUrl ?? riddleFiles.mobileSvgUrl ?? null;
  } else {
    return riddleFiles.backgroundMp4Url ?? riddleFiles.backgroundPngUrl ?? riddleFiles.backgroundSvgUrl ?? null;
  }
}

function getCleanUrl(url: string) {
  return url.split('?')[0].toLowerCase();
}


function getFileTypeFromUrl(fileUrl: string): string {
  // Remove query string if present
  const cleanUrl = fileUrl.split('?')[0];
  const urlPath = new URL(cleanUrl).pathname;
  const fileName = urlPath.split('/').pop() || '';

  if (fileName.startsWith('web_') && fileName.endsWith('.svg')) return 'web.svg';
  if (fileName.startsWith('web_') && fileName.endsWith('.png')) return 'web.png';
  if (fileName.startsWith('web_') && fileName.endsWith('.mp4')) return 'web.mp4';
  if (fileName.startsWith('mobile_') && fileName.endsWith('.svg')) return 'mobile.svg';
  if (fileName.startsWith('mobile_') && fileName.endsWith('.png')) return 'mobile.png';
  if (fileName.startsWith('mobile_') && fileName.endsWith('.mp4')) return 'mobile.mp4';
  if (fileName.startsWith('index_') && fileName.endsWith('.html')) return 'index.html';
  if (fileName.startsWith('style_') && fileName.endsWith('.css')) return 'style.css';
  if (fileName.startsWith('script_') && fileName.endsWith('.js')) return 'script.js';

  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'svg': return 'web.svg';
    case 'png': return 'web.png';
    case 'mp4': return 'web.mp4';
    case 'html':
    case 'htm': return 'index.html';
    case 'css': return 'style.css';
    case 'js':
    case 'mjs': return 'script.js';
    default: return 'unknown.txt';
  }
}

function updateBackground(layer: HTMLDivElement, riddleFiles: RiddleFileContents, width: number) {
  const url = getBackgroundForScreen(riddleFiles, width);
  const isMobile = width < 640;

  const existingVideo = layer.querySelector('video');
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.removeAttribute('src');
    existingVideo.load();
    existingVideo.remove();
  }

  layer.innerHTML = "";
  layer.style.backgroundImage = "";

  if (!url) {
    if (isMobile) {
      const message = document.createElement("p");
      message.textContent = "No mobile version available for this riddle. Try on desktop for full experience.";
      message.style.cssText = `
        color: white;
        font-size: 18px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `;
      layer.appendChild(message);
    }
    return;
  }

  if (url.endsWith('.mp4')) {
    const videoEl = document.createElement('video');
    videoEl.src = url;
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.preload = 'metadata';
    videoEl.style.width = '100%';
    videoEl.style.height = '100%';
    videoEl.style.objectFit = 'cover';
    layer.appendChild(videoEl);
    layer.style.backgroundImage = '';
  } else {
    layer.style.backgroundImage = `url('${url}')`;
  }
}


export default function RiddleLoader({ riddleId, riddleData: passedRiddleData, handleSolutionSubmit }: RiddleLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riddleFileContents, setRiddleFileContents] = useState<RiddleFileContents | null>(null);
  const [riddleData, setRiddleData] = useState<RiddleApiData | null>(passedRiddleData ?? null);
  const windowWidth = useWindowWidth();
  const currentBackgroundLayer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (riddleFileContents && currentBackgroundLayer.current) {
      updateBackground(currentBackgroundLayer.current, riddleFileContents, windowWidth);
    }
  }, [windowWidth, riddleFileContents]);

  const cleanupAllRiddleElements = () => {
    document.querySelectorAll("video").forEach(video => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });

    document.querySelectorAll('[class*="riddle-background"], [id*="riddle-background"]').forEach(el => el.remove());
    document.querySelectorAll('.background-layer').forEach(el => el.remove());
    document.querySelectorAll('[class*="riddle-component"], [id*="riddle-component"]').forEach(el => el.remove());
    document.querySelectorAll('style[data-riddle*="riddle-"]').forEach(el => el.remove());
    document.querySelectorAll('script[data-riddle*="riddle-"]').forEach(el => el.remove());

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  useEffect(() => {
    let cancelled = false;

    const loadRiddleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        cleanupAllRiddleElements();

        const targetRiddle = passedRiddleData ?? await getRiddleById(riddleId);
        if (cancelled) return;

        setRiddleData(targetRiddle);

        let files: RiddleFileContents | null = null;
        if (targetRiddle.files?.length) {
          files = await fetchRiddleFileContents(targetRiddle.files);
          if (cancelled) return;
          setRiddleFileContents(files);
        }

        await createRiddleLayersWithLoadedAssets(targetRiddle.id, files);

        if (!cancelled) setIsLoading(false);// pass it
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load riddle');
          setIsLoading(false);
        }
      }
    };

    loadRiddleData();
    return () => {
      cancelled = true;
      cleanupAllRiddleElements();
    };
  }, [riddleId, passedRiddleData]);


  const createRiddleLayersWithLoadedAssets = async (id: number, riddleFileContents: RiddleFileContents | null) => {
    if (!containerRef.current || !riddleFileContents) return;
    const container = containerRef.current;
    container.innerHTML = "";

    // create riddle component
    const riddleComponent = document.createElement('div');
    riddleComponent.id = `riddle-component-${id}`;
    riddleComponent.className = 'riddle-component relative z-10';
    container.appendChild(riddleComponent);

    await loadRiddleAssets(id, riddleComponent, riddleFileContents);

    const backgroundLayer = document.createElement('div');
    backgroundLayer.id = `riddle-background-${id}`;
    backgroundLayer.className = 'riddle-background absolute inset-0 z-0';
    backgroundLayer.style.cssText = `width:100%; height:100%; background-size: cover; background-position: center; background-repeat: no-repeat;`;
    if ((passedRiddleData?.type === 'CLICK_ACTION' || passedRiddleData?.type === 'TEXT_MATCH') && typeof handleSolutionSubmit === 'function') {
      addClickableEventByRiddleId(passedRiddleData?.level_id || id, backgroundLayer, () => handleSolutionSubmit!(null, id, true));
    }
    container.appendChild(backgroundLayer);

    currentBackgroundLayer.current = backgroundLayer;

    updateBackground(backgroundLayer, riddleFileContents, windowWidth);
  };

  if (riddleData?.level_id === 15) {
    return (
      <div className="absolute inset-0 z-0 w-full h-full">
        <Riddle15 />
      </div>
    );
  }

  const loadRiddleAssets = async (id: number, riddleComponent: HTMLElement, riddleFileContents: RiddleFileContents) => {
    try {
      if (riddleFileContents.cssContent) {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-riddle', `riddle-${id}`);
        styleElement.textContent = riddleFileContents.cssContent + `
          .background-layer { display: none !important; }
        `;
        document.head.appendChild(styleElement);
      }

      if (riddleFileContents.htmlContent) {
        let modifiedHtml = riddleFileContents.htmlContent;
        modifiedHtml = modifiedHtml.replace(/<div[^>]*class="[^"]*background-layer[^"]*"[^>]*><\/div>/gi, '');
        modifiedHtml = modifiedHtml.replace(/<img[^>]+src=["']?riddle(\d+)?\.(png|jpg|jpeg|svg)["']?[^>]*>/gi, '');

        riddleComponent.innerHTML = modifiedHtml;

        const btn = riddleComponent.querySelector("#start-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            console.log("✅ Start button clicked!");
          });
        }
      }

      if (riddleFileContents.jsContent) {
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('data-riddle', `riddle-${id}`);
        scriptElement.textContent = `(function(){ ${riddleFileContents.jsContent} })();`;
        document.body.appendChild(scriptElement);
      }
    } catch (error) {
      console.error('Error loading riddle assets:', error);
    }
  };

  return (
    <div>
      <div ref={containerRef} />

      {isLoading && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-linear-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6 p-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-yellow-500/30 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-gray-900 font-bold text-sm">?</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-yellow-400">Loading Riddle {riddleData?.level_id || riddleId}</h3>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Riddle {riddleData?.level_id || riddleId} Not Found
            </h3>
            <p className="text-gray-400">This riddle doesn't exist</p>
          </div>
        </div>
      )}
    </div>
  );
}
