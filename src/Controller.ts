export let make_spin: () => Promise<void>;

const IS_REAL_SERVER = false;
const cheats_enabled = true;

if (IS_REAL_SERVER) {
    if (!cheats_enabled) {
        make_spin = async () => {
            const result = await Promise.resolve();
            return result;
        };
    } else {
        make_spin = async () => {
            const result = await Promise.resolve();
            return result;
        };
    }
} else {
    if (!cheats_enabled) {
        make_spin = async () => {
            const result = await Promise.resolve();
            return result;
        };
    } else {
        make_spin = async () => {
            const result = await Promise.resolve();
            return result;
        };
    }
}
