import {
    BrowserContextOptions, Response, Browser as PwBrowser,
    LaunchOptions, BrowserType as PwBrowserType, BrowserContext as PwBrowserContext, BrowserServer,
    firefox as pwFirefox, chromium as pwChromium, webkit as pwWebkit, ConnectOverCDPOptions,
    ConnectOptions, Page as PwPage, FrameLocator
} from "playwright"
import { Connection, Org } from "@salesforce/core";
import axios from "axios";

type BrowserType = 'chromium' | 'firefox' | 'webkit';

/**
 * https://help.salesforce.com/s/articleView?id=xcloud.domain_name_url_formats.htm&type=5
 */
export type SfUrlType = 'Login' | 'ApplicationPageOrTab' | 'CmsPublicChannel' | 'EmailTracking' | 'Lightning'
    | 'ExperienceCloudSite' | 'LightningContainer' | 'SalesforceSite' | 'SetupPage' | 'ServiceCloudRealtime'
    | 'OmniChannel' | 'UserContent' | 'UserContentGovCloud' | 'UserImage' | 'ContentFile' | 'ExperienceBuilder'
    | 'ExperienceBuilderLivePreview' | 'ExperienceBuilderPreview' | 'Visualforce';

enum SfPartitions {
    DEVELOP = "develop",
    DEMO = "demo",
    PATCH = "patch",
    SANDBOX = "sandbox",
    SCRATCH = "scratch",
    TRAILBLAZER = "trailblazer"
}

export type GotoOptions = Parameters<PwPage['goto']>[1] & {
    sfPageID?: string;
    sfExperienceCloudSitesSubdomainName?: string;
    sfPackageName?: string;
    sfSitesSubdomainName?: string;
    sfLiveAgentPool?: string;
    sfUniqueID?: string;
};

function getBrowserType(browserType: BrowserType): PwBrowserType {
    if (browserType === 'chromium') return pwChromium;
    if (browserType === 'firefox') return pwFirefox;
    if (browserType === 'webkit') return pwWebkit;
    throw new Error(`Unknown BrowserType ${browserType}`);
}

const pwsf = {
    async connectOverCDP(
        browserType: BrowserType,
        arg1: string | (ConnectOverCDPOptions & { wsEndpoint: string }),
        arg2?: ConnectOverCDPOptions
    ): Promise<Browser> {
        const browser = getBrowserType(browserType);
        if (typeof arg1 === 'string') {
            return BrowserExtension.create(await browser.connectOverCDP(arg1, arg2)) as Browser;
        } else {
            return BrowserExtension.create(await browser.connectOverCDP(arg1)) as Browser;
        }
    },

    async connect(
        browserType: BrowserType,
        arg1: string | (ConnectOptions & { wsEndpoint: string }),
        arg2?: ConnectOptions
    ): Promise<Browser> {
        const browser = getBrowserType(browserType);
        if (typeof arg1 === 'string') {
            return BrowserExtension.create(await browser.connect(arg1, arg2)) as Browser;
        } else {
            return BrowserExtension.create(await browser.connect(arg1)) as Browser;
        }
    },

    executablePath(browserType: BrowserType): string {
        return getBrowserType(browserType).executablePath();
    },

    async launch(browserType: BrowserType, options?: LaunchOptions): Promise<Browser> {
        const browser = getBrowserType(browserType);
        return BrowserExtension.create(await browser.launch(options)) as Browser;
    },

    async launchPersistentContext(
        browserType: BrowserType,
        userDataDir: string,
        options?: Parameters<PwBrowserType['launchPersistentContext']>[1]
    ): Promise<BrowserContext> {
        const browser = getBrowserType(browserType);
        return ContextExtension.create(browser as unknown as Browser, await browser.launchPersistentContext(userDataDir, options)) as BrowserContext;
    },

    async launchServer(
        browserType: BrowserType,
        options?: Parameters<PwBrowserType['launchServer']>[0]
    ): Promise<BrowserServer> {
        return await getBrowserType(browserType).launchServer(options);
    },

    name(browserType: BrowserType): string {
        return getBrowserType(browserType).name();
    },
};

export const chromium = {
    ...pwsf,
    connectOverCDP: (arg1: string | (ConnectOverCDPOptions & { wsEndpoint: string }), arg2?: ConnectOverCDPOptions) =>
        pwsf.connectOverCDP('chromium', arg1, arg2),
    connect: (arg1: string | (ConnectOptions & { wsEndpoint: string }), arg2?: ConnectOptions) =>
        pwsf.connect('chromium', arg1, arg2),
    executablePath: () => pwsf.executablePath('chromium'),
    launch: (options?: LaunchOptions) => pwsf.launch('chromium', options),
    launchPersistentContext: (userDataDir: string, options?: Parameters<PwBrowserType['launchPersistentContext']>[1]) =>
        pwsf.launchPersistentContext('chromium', userDataDir, options),
    launchServer: (options?: Parameters<PwBrowserType['launchServer']>[0]) =>
        pwsf.launchServer('chromium', options),
    name: () => pwsf.name('chromium'),
};

export const firefox = {
    ...pwsf,
    connectOverCDP: (arg1: string | (ConnectOverCDPOptions & { wsEndpoint: string }), arg2?: ConnectOverCDPOptions) =>
        pwsf.connectOverCDP('firefox', arg1, arg2),
    connect: (arg1: string | (ConnectOptions & { wsEndpoint: string }), arg2?: ConnectOptions) =>
        pwsf.connect('firefox', arg1, arg2),
    executablePath: () => pwsf.executablePath('firefox'),
    launch: (options?: LaunchOptions) => pwsf.launch('firefox', options),
    launchPersistentContext: (userDataDir: string, options?: Parameters<PwBrowserType['launchPersistentContext']>[1]) =>
        pwsf.launchPersistentContext('firefox', userDataDir, options),
    launchServer: (options?: Parameters<PwBrowserType['launchServer']>[0]) =>
        pwsf.launchServer('firefox', options),
    name: () => pwsf.name('firefox'),
};

export const webkit = {
    ...pwsf,
    connectOverCDP: (arg1: string | (ConnectOverCDPOptions & { wsEndpoint: string }), arg2?: ConnectOverCDPOptions) =>
        pwsf.connectOverCDP('webkit', arg1, arg2),
    connect: (arg1: string | (ConnectOptions & { wsEndpoint: string }), arg2?: ConnectOptions) =>
        pwsf.connect('webkit', arg1, arg2),
    executablePath: () => pwsf.executablePath('webkit'),
    launch: (options?: LaunchOptions) => pwsf.launch('webkit', options),
    launchPersistentContext: (userDataDir: string, options?: Parameters<PwBrowserType['launchPersistentContext']>[1]) =>
        pwsf.launchPersistentContext('webkit', userDataDir, options),
    launchServer: (options?: Parameters<PwBrowserType['launchServer']>[0]) =>
        pwsf.launchServer('webkit', options),
    name: () => pwsf.name('webkit'),
};



export type Browser = BrowserExtension & Omit<PwBrowser, 'newPage'>;
/**
 * Wrapper around Playwright Browser with proxy forwarding.
 */
class BrowserExtension {
    private browser: PwBrowser;

    constructor(browser: PwBrowser) {
        this.browser = browser;
    }

    /**
     * Creates a proxied instance of BrowserExtension.
     * @param browser Playwright Browser instance
     */
    public static create(browser: PwBrowser): Browser {
        const instance = new BrowserExtension(browser);
        return new Proxy(instance, {
            get(target, prop, receiver) {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver);
                }

                const value = Reflect.get(browser, prop as keyof PwBrowser);
                if (typeof value === 'function') {
                    return value.bind(browser);
                }
                return value;
            }
        }) as unknown as Browser;
    }

    /**
     * Creates a new page in a fresh context.
     */
    public async newPage(options?: BrowserContextOptions): Promise<Page> {
        return ContextExtension.create(this as unknown as Browser, await this.browser.newContext(options)).newPage();
    }

    /**
     * Creates a new browser context.
     * @param options Browser context options
     */
    public async newContext(options?: BrowserContextOptions): Promise<BrowserContext> {
        return ContextExtension.create(this as unknown as Browser, await this.browser.newContext(options)) as BrowserContext;
    }
}

export type BrowserContext = ContextExtension & PwBrowserContext;
/**
 * Wrapper around Playwright BrowserContext with proxy forwarding and added Salesforce login support.
 */
class ContextExtension {
    private context: PwBrowserContext;
    private Browser: Browser;
    private authedOrgs: Map<string, Org> = new Map();

    constructor(browser: Browser, context: PwBrowserContext) {
        this.context = context;
        this.Browser = browser;
    }

    /**
     * Creates a proxied instance of ContextExtension.
     * @param browser Browser instance
     * @param context Playwright BrowserContext instance
     */
    public static create(browser: Browser, context: PwBrowserContext): BrowserContext {
        const instance = new ContextExtension(browser, context);
        return new Proxy(instance, {
            get(target, prop, receiver) {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver);
                }

                const value = Reflect.get(context, prop as keyof PwBrowserContext);
                if (typeof value === 'function') {
                    return value.bind(context);
                }
                return value;
            }
        }) as unknown as BrowserContext;
    }

    /**
     * Creates a new page in this context.
     */
    public async newPage(): Promise<Page> {

        let page: PwPage;
        const pages: PwPage[] = this.context.pages();

        if (pages.length == 1 && (pages[0].url()) == 'about:blank') {
            page = pages[0];
        } else {
            page = await this.context.newPage();
        }
        return PageExtension.create(this as unknown as BrowserContext, page) as unknown as Page;
    }

    /**
     * Perform a login to Salesforce org on the given page or a new page. Usually you do not have to call login()
     * manually. It is called automatically when navigating to a salesforce page.
     * If you are already logged in the method just returns - except you enforce a re-login.
     * @param org Salesforce Org instance
     * @param reLogin Perform a login even if we already did a login to that org within that browser context
     * @param page Optional page to use for login
     */
    public async login(org: Org, reLogin: boolean = false, page?: PwPage | Page): Promise<void> {

        const username = org.getUsername();
        if (!username) {
            throw new Error(`Something went wrong during SFCLI login. The Username of the org is undefined.`);
        }

        if (!reLogin && this.authedOrgs.has(username)) {
            return;
        }

        const returnUrl: string = '/lightning/settings/personal/PersonalInformation/home'

        const loginPage: Page | PwPage = page ? page : await this.context.newPage();

        await org.refreshAuth();
        const conn = org.getConnection();

        const response = await axios.post(`${conn.instanceUrl}/services/oauth2/singleaccess`, null, {
            params: {
                access_token: conn.accessToken,
                redirect_uri: returnUrl
            },
            maxRedirects: 0,
            validateStatus: status => status < 400
        });

        const frontdoorUrl = response.data.frontdoor_uri;
        await loginPage.goto(frontdoorUrl);
        await loginPage.waitForURL(`**${returnUrl}`);

        this.authedOrgs.set(username, org);
        if (loginPage !== page) {
            await loginPage.close();
        }
    }
}

export type Page = PageExtension & Omit<PwPage, 'context' | 'create'>;
/**
 * Wrapper around Playwright Page with proxy forwarding and Salesforce URL navigation support.
 */
export class PageExtension {
    private page: PwPage;
    private browserContext: BrowserContext;

    constructor(context: BrowserContext, page: PwPage) {
        this.page = page;
        this.browserContext = context;
    }

    /**
     * Creates a proxied instance of PageExtension.
     * @param context BrowserContext instance
     * @param page Playwright Page instance
     */
    public static create(context: BrowserContext, page: PwPage): Page {
        const instance = new PageExtension(context, page);
        return new Proxy(instance, {
            get(target, prop, receiver) {
                if (prop in target) {
                    return Reflect.get(target, prop, receiver);
                }

                const value = Reflect.get(page, prop as keyof PwPage);
                if (typeof value === 'function') {
                    return value.bind(page);
                }
                return value;
            }
        }) as unknown as Page;
    }

    /**
     * Returns a Locator for any iframe on the page.
     */
    public anyFrameLocator(): FrameLocator {
        return this.page.frameLocator('iFrame');
    }

    public context(): BrowserContext {
        return this.browserContext;
    }

    private getPartition(conn: Connection): SfPartitions | undefined {
        const hostnameParts = new URL(conn.instanceUrl).hostname.split('.');
        const maybePartition = hostnameParts[hostnameParts.length - 4];
        return Object.values(SfPartitions).includes(maybePartition as SfPartitions)
            ? (maybePartition as SfPartitions)
            : undefined;
    }

    /**
     * Navigate to a Salesforce URL built from org, urlType and path.
     * @param org Salesforce Org instance
     * @param urlType Type of Salesforce URL to build
     * @param path Absolute path to navigate to
     * @param options Additional navigation options
     */
    public async goto(org: Org, urlType: SfUrlType, path: string, options?: GotoOptions): Promise<Response | null>;

    /**
     * Navigate to a given URL.
     * @param url URL string
     * @param options Additional navigation options
     */

    public async goto(...args: any[]): Promise<Response | null> {
        if (typeof args[0] === 'string') {
            const [url, options] = args as [string, Parameters<PwPage['goto']>[1]];
            return this.page.goto(url, options);
        } else {
            const [org, urlType, path, options] = args as [Org, SfUrlType, string, GotoOptions];
            const conn = org.getConnection();
            if (/^https?:\/\//.test(path)) throw new Error(`Please provide only the absolute path (without protocol and host). The protocol and host is added automatically matching your org and the given SfUrlType.`);
            let trimmedPath = path.startsWith("/") ? path.slice(1) : path;
            const partition = this.getPartition(conn);
            const myDomain = (new URL(conn.instanceUrl).host).match(/^(.*?)(?=--|\.)/)?.[1];
            if (!myDomain) {
                throw new Error('Could not extract myDomain from connection instanceUrl');
            }
            const sandboxName = partition === SfPartitions.SANDBOX
                ? conn.instanceUrl.match(/--([^.]*)\./)?.[1]
                : undefined;
            const protocol = new URL(conn.instanceUrl).protocol;
            const { domain, finalPath } = this.buildSalesforceUrl(
                urlType,
                myDomain,
                partition,
                sandboxName,
                options,
                trimmedPath
            );
            const url = `${protocol}//${domain}/${finalPath}`;
            await this.browserContext.login(org, false, this.page);
            return this.page.goto(url, options);
        }
    }

    /**
     * https://help.salesforce.com/s/articleView?id=xcloud.domain_name_url_formats.htm&type=5
     * @param urlType 
     * @param myDomain 
     * @param partition 
     * @param sandboxName 
     * @param options 
     * @param trimmedPath 
     * @returns 
     */
    private buildSalesforceUrl(
        urlType: SfUrlType,
        myDomain: string,
        partition: SfPartitions | undefined,
        sandboxName: string | undefined,
        options: GotoOptions | undefined,
        trimmedPath: string
    ): { domain: string, finalPath: string } {
        // Helper to build subdomain string
        function sfSubdomain(base: string, opts?: { pkg?: string, uniqueId?: string }) {
            let sub = base;
            if (opts?.pkg) sub += `--${opts.pkg}`;
            if (opts?.uniqueId) sub += `--${opts.uniqueId}`;
            if (sandboxName) sub += `--${sandboxName}`;
            return sub;
        }
        // Helper to assert required options
        function assertRequiredOption(opt: any, optName: string, context: string) {
            if (!opt) throw new Error(`Missing required option \`${optName}\` for ${context} URL type`);
        }

        let domain: string;
        let finalPath = trimmedPath;
        switch (urlType) {
            case 'Login':
            case 'ApplicationPageOrTab':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.salesforce.com`;
                break;
            case 'ContentFile':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}file.force.com`;
                break;
            case 'CmsPublicChannel':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}cdn.salesforce-experience.com`;
                break;
            case 'EmailTracking':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.sfdcopens.com`;
                break;
            case 'ExperienceCloudSite':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.site.com`;
                break;
            case 'ExperienceBuilder':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}builder.salesforce-experience.com`;
                break;
            case 'ExperienceBuilderPreview':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}preview.salesforce-experience.com`;
                break;
            case 'ExperienceBuilderLivePreview':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}live-preview.salesforce-experience.com`;
                break;
            case 'Lightning':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}lightning.force.com`;
                break;
            case 'LightningContainer': {
                const pkg = options?.sfPackageName || 'c';
                domain = `${sfSubdomain(myDomain, { pkg })}.${partition ? partition + '.' : ''}container.force.com`;
                break;
            }
            case 'SalesforceSite': {
                assertRequiredOption(options?.sfPageID, 'sfPageID', 'SalesforceSite');
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.salesforce-sites.com`;
                if (!trimmedPath.startsWith(options!.sfPageID + '/') || trimmedPath === options!.sfPageID) {
                    finalPath = options!.sfPageID + '/' + trimmedPath;
                }
                break;
            }
            case 'SetupPage':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.salesforce-setup.com`;
                break;
            case 'ServiceCloudRealtime':
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.salesforce-scrt.com`;
                break;
            case 'UserContent': {
                assertRequiredOption(options?.sfUniqueID, 'sfUniqueID', 'UserContent');
                domain = `${sfSubdomain(myDomain, { uniqueId: options!.sfUniqueID })}.${partition ? partition + '.' : ''}my.force-user-content.com`;
                break;
            }
            case 'UserContentGovCloud': {
                assertRequiredOption(options?.sfUniqueID, 'sfUniqueID', 'UserContentGovCloud');
                domain = `${sfSubdomain(myDomain, { uniqueId: options!.sfUniqueID })}.${partition ? partition + '.' : ''}gia.force-user-content.com`;
                break;
            }
            case 'UserImage': {
                assertRequiredOption(options?.sfUniqueID, 'sfUniqueID', 'UserImage');
                domain = `${sfSubdomain(myDomain, { uniqueId: options!.sfUniqueID })}.${partition ? partition + '.' : ''}file.force-user-content.com`;
                break;
            }
            case 'Visualforce': {
                const vfPkg = options?.sfPackageName || 'c';
                domain = `${sfSubdomain(myDomain, { pkg: vfPkg })}.${partition ? partition + '.' : ''}vf.force.com`;
                break;
            }
            default:
                domain = `${sfSubdomain(myDomain)}.${partition ? partition + '.' : ''}my.salesforce.com`;
                break;
        }
        return { domain, finalPath };
    }

}