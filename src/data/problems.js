// 101 Classic DSA Problems Database
export const problems = [
  // ==================== ARRAYS & HASHING ====================
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companyTags: ["Google", "Meta", "Amazon", "Apple", "Microsoft"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    templates: {
      javascript: `function twoSum(nums, target) {\n    // Write your code here\n    \n}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your code here\n    pass`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}`,
      java: `public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    \n}`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], inputStr: "[2,7,11,15], 9" },
      { input: [[3, 2, 4], 6], expected: [1, 2], inputStr: "[3,2,4], 6" },
      { input: [[3, 3], 6], expected: [0, 1], inputStr: "[3,3], 6" }
    ],
    explanation: {
      bruteForce: {
        code: `function twoSum(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) return [i, j];\n        }\n    }\n}`,
        complexity: "Time: O(N^2), Space: O(1)",
        explanation: "Check every pair of elements by running nested loops. Return indices when sum matches."
      },
      optimal: {
        code: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n}`,
        complexity: "Time: O(N), Space: O(N)",
        explanation: "Store visited numbers and their indices in a hash map. For each number, check if its complement (target - num) exists in the map."
      }
    }
  },
  {
    id: 2,
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companyTags: ["Amazon", "Microsoft", "Apple"],
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    templates: {
      javascript: `function containsDuplicate(nums) {\n    // Write your code here\n    \n}`,
      python: `def containsDuplicate(nums: List[int]) -> bool:\n    # Write your code here\n    pass`,
      cpp: `bool containsDuplicate(vector<int>& nums) {\n    // Write your code here\n    \n}`,
      java: `public boolean containsDuplicate(int[] nums) {\n    // Write your code here\n    \n}`
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true, inputStr: "[1,2,3,1]" },
      { input: [[1, 2, 3, 4]], expected: false, inputStr: "[1,2,3,4]" },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true, inputStr: "[1,1,1,3,3,4,3,2,4,2]" }
    ],
    explanation: {
      bruteForce: {
        code: `function containsDuplicate(nums) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] === nums[j]) return true;\n        }\n    }\n    return false;\n}`,
        complexity: "Time: O(N^2), Space: O(1)",
        explanation: "Compare every element with all other elements."
      },
      optimal: {
        code: `function containsDuplicate(nums) {\n    const set = new Set();\n    for (const num of nums) {\n        if (set.has(num)) return true;\n        set.add(num);\n    }\n    return false;\n}`,
        complexity: "Time: O(N), Space: O(N)",
        explanation: "Iterate through the array while adding elements to a hash set. If an element already exists, return true."
      }
    }
  },
  {
    id: 3,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companyTags: ["Google", "Amazon", "Meta"],
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
      { input: "s = \"rat\", t = \"car\"", output: "false" }
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
    templates: {
      javascript: `function isAnagram(s, t) {\n    // Write your code here\n    \n}`,
      python: `def isAnagram(s: str, t: str) -> bool:\n    # Write your code here\n    pass`
    },
    testCases: [
      { input: ["anagram", "nagaram"], expected: true, inputStr: '"anagram", "nagaram"' },
      { input: ["rat", "car"], expected: false, inputStr: '"rat", "car"' }
    ],
    explanation: {
      bruteForce: {
        code: `function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split('').sort().join('') === t.split('').sort().join('');\n}`,
        complexity: "Time: O(N log N), Space: O(N)",
        explanation: "Sort both strings alphabetically and compare them."
      },
      optimal: {
        code: `function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const counts = {};\n    for (let char of s) {\n        counts[char] = (counts[char] || 0) + 1;\n    }\n    for (let char of t) {\n        if (!counts[char]) return false;\n        counts[char]--;\n    }\n    return true;\n}`,
        complexity: "Time: O(N), Space: O(K) where K is alphabet size (26)",
        explanation: "Count character frequencies of `s` in a hash map. Decrement frequencies using `t`. If all frequencies hit zero, they are anagrams."
      }
    }
  },
  {
    id: 4,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Meta", "Amazon", "Google"],
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    templates: {
      javascript: `function groupAnagrams(strs) {\n    // Write your code here\n    \n}`
    },
    testCases: [
      {
        input: [["eat","tea","tan","ate","nat","bat"]],
        expected: [["eat","tea","ate"],["tan","nat"],["bat"]], // Note: order-independent equality will be checked in runner
        inputStr: '["eat","tea","tan","ate","nat","bat"]'
      }
    ],
    explanation: {
      optimal: {
        code: `function groupAnagrams(strs) {\n    const groups = {};\n    for (const str of strs) {\n        const key = str.split('').sort().join('');\n        if (!groups[key]) groups[key] = [];\n        groups[key].push(str);\n    }\n    return Object.values(groups);\n}`,
        complexity: "Time: O(N * K log K), Space: O(N * K) where K is maximum string length.",
        explanation: "Sort each string to create a unique key representing its anagram group. Store the grouped strings in a hash map."
      }
    }
  },
  {
    id: 5,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Google", "Amazon", "Meta"],
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }
    ],
    templates: {
      javascript: `function topKFrequent(nums, k) {\n    // Write your code here\n    \n}`
    },
    testCases: [
      { input: [[1,1,1,2,2,3], 2], expected: [1, 2], inputStr: "[1,1,1,2,2,3], 2" }
    ],
    explanation: {
      optimal: {
        code: `function topKFrequent(nums, k) {\n    const counts = new Map();\n    nums.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));\n    const bucket = Array.from({length: nums.length + 1}, () => []);\n    for (let [num, count] of counts.entries()) {\n        bucket[count].push(num);\n    }\n    const res = [];\n    for (let i = bucket.length - 1; i >= 0 && res.length < k; i--) {\n        if (bucket[i].length) res.push(...bucket[i]);\n    }\n    return res.slice(0, k);\n}`,
        complexity: "Time: O(N), Space: O(N)",
        explanation: "Use Bucket Sort. Count frequencies, group numbers into buckets indexed by their frequencies, then grab elements from the highest index bucket down to k."
      }
    }
  },
  {
    id: 6,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Amazon", "Apple", "Microsoft"],
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.",
    examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }],
    templates: { javascript: `function productExceptSelf(nums) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[1,2,3,4]], expected: [24,12,8,6], inputStr: "[1,2,3,4]" }],
    explanation: {
      optimal: {
        code: `function productExceptSelf(nums) {\n    const res = [];\n    let prefix = 1;\n    for (let i = 0; i < nums.length; i++) {\n        res[i] = prefix;\n        prefix *= nums[i];\n    }\n    let postfix = 1;\n    for (let i = nums.length - 1; i >= 0; i--) {\n        res[i] *= postfix;\n        postfix *= nums[i];\n    }\n    return res;\n}`,
        complexity: "Time: O(N), Space: O(1) auxiliary space",
        explanation: "Compute prefix products in a first pass. Then, compute postfix products in a second backward pass, multiplying into the prefix results."
      }
    }
  },
  {
    id: 7,
    title: "Valid Sudoku",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Google", "Uber"],
    description: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the Sudoku rules.",
    templates: { javascript: `function isValidSudoku(board) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(1), Space: O(1)", explanation: "Scan rows, columns, and 3x3 grids for duplicates using Sets." } }
  },
  {
    id: 8,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Google", "Meta"],
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(n)` time.",
    examples: [{ input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "Longest consecutive sequence is [1, 2, 3, 4]." }],
    templates: { javascript: `function longestConsecutive(nums) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[100, 4, 200, 1, 3, 2]], expected: 4, inputStr: "[100,4,200,1,3,2]" }],
    explanation: {
      optimal: {
        code: `function longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (const num of nums) {\n        if (!set.has(num - 1)) {\n            let currentNum = num;\n            let currentStreak = 1;\n            while (set.has(currentNum + 1)) {\n                currentNum++;\n                currentStreak++;\n            }\n            longest = Math.max(longest, currentStreak);\n        }\n    }\n    return longest;\n}`,
        complexity: "Time: O(N), Space: O(N)",
        explanation: "Store numbers in a Set. Only start checking sequences from a number that has no left-neighbor (i.e. num - 1 is not in Set). Traverse upwards incrementing elements."
      }
    }
  },
  {
    id: 9,
    title: "Find All Duplicates in an Array",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Microsoft"],
    description: "Given an integer array `nums` of length `n` where all integers are in range `[1, n]` and each integer appears once or twice, return an array of duplicates.",
    templates: { javascript: `function findDuplicates(nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Negate elements at indices corresponding to absolute values to mark visited values. If an element is already negative, it's a duplicate." } }
  },
  {
    id: 10,
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    companyTags: ["Meta", "Google"],
    description: "Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.",
    templates: { javascript: `function subarraySum(nums, k) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Use a hash map to store prefix sum frequencies. For a current prefix sum S, add count of S - K to the running total." } }
  },

  // ==================== TWO POINTERS ====================
  {
    id: 11,
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Two Pointers",
    companyTags: ["Microsoft", "Meta", "Apple"],
    description: "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters.",
    examples: [{ input: "s = \"A man, a plan, a canal: Panama\"", output: "true" }],
    templates: { javascript: `function isPalindrome(s) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, inputStr: '"A man, a plan, a canal: Panama"' },
      { input: ["race a car"], expected: false, inputStr: '"race a car"' }
    ],
    explanation: {
      optimal: {
        code: `function isPalindrome(s) {\n    let l = 0, r = s.length - 1;\n    const isAlphanumeric = c => /[a-zA-Z0-9]/.test(c);\n    while (l < r) {\n        while (l < r && !isAlphanumeric(s[l])) l++;\n        while (l < r && !isAlphanumeric(s[r])) r--;\n        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n        l++;\n        r--;\n    }\n    return true;\n}`,
        complexity: "Time: O(N), Space: O(1)",
        explanation: "Initialize pointers at the start and end of the string. Skip non-alphanumeric characters and compare letters, converging in the middle."
      }
    }
  },
  {
    id: 12,
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Medium",
    category: "Two Pointers",
    companyTags: ["Amazon", "Google"],
    description: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.",
    templates: { javascript: `function twoSumSorted(numbers, target) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Use left and right pointers. Move left inwards if sum is too small, and right inwards if sum is too large." } }
  },
  {
    id: 13,
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    companyTags: ["Meta", "Amazon", "Apple"],
    description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
    templates: { javascript: `function threeSum(nums) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], inputStr: "[-1,0,1,2,-1,-4]" }],
    explanation: {
      optimal: {
        code: `function threeSum(nums) {\n    nums.sort((a,b) => a-b);\n    const res = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i-1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l+1]) l++;\n                while (l < r && nums[r] === nums[r-1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}`,
        complexity: "Time: O(N^2), Space: O(log N) sorting space",
        explanation: "Sort array. Iterate through, treating each element as a fixed target. For the remaining subarray, use two pointers to find pairs that sum to the negative target."
      }
    }
  },
  {
    id: 14,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    companyTags: ["Google", "Amazon"],
    description: "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
    templates: { javascript: `function maxArea(height) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, inputStr: "[1,8,6,2,5,4,8,3,7]" }],
    explanation: {
      optimal: {
        code: `function maxArea(height) {\n    let l = 0, r = height.length - 1;\n    let maxVal = 0;\n    while (l < r) {\n        const area = Math.min(height[l], height[r]) * (r - l);\n        maxVal = Math.max(maxVal, area);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxVal;\n}`,
        complexity: "Time: O(N), Space: O(1)",
        explanation: "Two pointers at bounds. Calculate area, record the max, then move the pointer pointing to the shorter vertical line inwards."
      }
    }
  },
  {
    id: 15,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers",
    companyTags: ["Google", "Amazon", "Microsoft"],
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    templates: { javascript: `function trap(height) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Two pointers. Track leftMax and rightMax. Move the pointer with smaller height inwards and add height difference to sum." } }
  },
  {
    id: 16,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    category: "Two Pointers",
    companyTags: ["Microsoft"],
    description: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.",
    templates: { javascript: `function removeDuplicates(nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Use a slow-runner pointer `i` and fast-runner pointer `j`. When nums[j] != nums[i], increment `i` and copy nums[j] to nums[i]." } }
  },
  {
    id: 17,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    category: "Two Pointers",
    companyTags: ["Meta", "Microsoft"],
    description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array.",
    templates: { javascript: `function merge(nums1, m, nums2, n) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(M+N), Space: O(1)", explanation: "Iterate from the back of both arrays, placing the larger element at the end of nums1 to avoid overwriting elements." } }
  },
  {
    id: 18,
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Two Pointers",
    companyTags: ["Google", "Meta"],
    description: "Given an integer array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements in-place.",
    templates: { javascript: `function moveZeroes(nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Use a pointer `lastNonZeroFoundAt`. Loop through, swap non-zero elements forward." } }
  },
  {
    id: 19,
    title: "Backspace String Compare",
    difficulty: "Easy",
    category: "Two Pointers",
    companyTags: ["Google"],
    description: "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. `#` means a backspace character.",
    templates: { javascript: `function backspaceCompare(s, t) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Iterate backward through both strings. Skip characters deleted by backspaces using a skip counter, then compare active characters." } }
  },
  {
    id: 20,
    title: "3Sum Closest",
    difficulty: "Medium",
    category: "Two Pointers",
    companyTags: ["Google", "Apple"],
    description: "Given an integer array `nums` of length `n` and an integer `target`, find three integers in `nums` such that the sum is closest to `target`. Return the sum.",
    templates: { javascript: `function threeSumClosest(nums, target) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N^2), Space: O(1)", explanation: "Sort the array. Iterate and use two pointers. Track the sum with the minimum absolute difference from target." } }
  },

  // ==================== SLIDING WINDOW ====================
  {
    id: 21,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Sliding Window",
    companyTags: ["Amazon", "Microsoft", "Google"],
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve. If you cannot achieve any profit, return 0.",
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5." }],
    templates: { javascript: `function maxProfit(prices) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, inputStr: "[7,1,5,3,6,4]" },
      { input: [[7, 6, 4, 3, 1]], expected: 0, inputStr: "[7,6,4,3,1]" }
    ],
    explanation: {
      optimal: {
        code: `function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let price of prices) {\n        if (price < minPrice) {\n            minPrice = price;\n        } else if (price - minPrice > maxProfit) {\n            maxProfit = price - minPrice;\n        }\n    }\n    return maxProfit;\n}`,
        complexity: "Time: O(N), Space: O(1)",
        explanation: "Keep track of the minimum price seen so far. For each stock price, check the potential profit if sold today, maintaining the maximum profit."
      }
    }
  },
  {
    id: 22,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    companyTags: ["Amazon", "Google", "Microsoft"],
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [{ input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }],
    templates: { javascript: `function lengthOfLongestSubstring(s) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: ["abcabcbb"], expected: 3, inputStr: '"abcabcbb"' },
      { input: ["bbbbb"], expected: 1, inputStr: '"bbbbb"' },
      { input: ["pwwkew"], expected: 3, inputStr: '"pwwkew"' }
    ],
    explanation: {
      optimal: {
        code: `function lengthOfLongestSubstring(s) {\n    const set = new Set();\n    let l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) {\n            set.delete(s[l]);\n            l++;\n        }\n        set.add(s[r]);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}`,
        complexity: "Time: O(N), Space: O(N)",
        explanation: "Use a sliding window. Move the right pointer to expand the substring, and if a duplicate is found, shrink the window from the left until unique."
      }
    }
  },
  {
    id: 23,
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    category: "Sliding Window",
    companyTags: ["Google", "Amazon"],
    description: "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.",
    templates: { javascript: `function characterReplacement(s, k) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(26)", explanation: "Maintain sliding window. Track char frequencies. If (window size - max frequency) > k, slide the left boundary." } }
  },
  {
    id: 24,
    title: "Permutation in String",
    difficulty: "Medium",
    category: "Sliding Window",
    companyTags: ["Microsoft", "Meta"],
    description: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.",
    templates: { javascript: `function checkInclusion(s1, s2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(26)", explanation: "Keep a sliding window of size s1.length in s2. Check if letter counts match using a frequency array." } }
  },
  {
    id: 25,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Sliding Window",
    companyTags: ["Google", "Meta", "Airbnb"],
    description: "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` is included in the window.",
    templates: { javascript: `function minWindow(s, t) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(M+N), Space: O(K)", explanation: "Expand sliding window with right pointer. Once all target characters are satisfied, shrink window from left to minimize length." } }
  },
  {
    id: 26,
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    category: "Sliding Window",
    companyTags: ["Google", "Amazon"],
    description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. Return the max sliding window.",
    templates: { javascript: `function maxSlidingWindow(nums, k) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(K)", explanation: "Use a monotonic double-ended queue (deque) to store indices. Maintain queue elements in decreasing order of value." } }
  },
  {
    id: 27,
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    category: "Sliding Window",
    companyTags: ["Meta"],
    description: "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`.",
    templates: { javascript: `function findAnagrams(s, p) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(S + P), Space: O(26)", explanation: "Slide a window of size P across S. Record index whenever counts of characters in the window match counts in P." } }
  },
  {
    id: 28,
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    category: "Sliding Window",
    companyTags: ["Microsoft"],
    description: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`.",
    templates: { javascript: `function minSubArrayLen(target, nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Slide right pointer to sum. Shrink left pointer as long as sum >= target, tracking the minimum window length." } }
  },

  // ==================== STACK & QUEUE ====================
  {
    id: 29,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    companyTags: ["Meta", "Google", "Microsoft"],
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if brackets close in the correct order and types match.",
    examples: [{ input: "s = \"()[]{}\"", output: "true" }],
    templates: { javascript: `function isValid(s) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: ["()[]{} "], expected: true, inputStr: '"()[]{}"' },
      { input: ["(]"], expected: false, inputStr: '"(]"' }
    ],
    explanation: {
      optimal: {
        code: `function isValid(s) {\n    const stack = [];\n    const mapping = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (char in mapping) {\n            const topElement = stack.pop();\n            if (topElement !== mapping[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}`,
        complexity: "Time: O(N), Space: O(N)",
        explanation: "Iterate over string. Push open brackets onto stack. Pop and check corresponding matches on closed brackets."
      }
    }
  },
  {
    id: 30,
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    companyTags: ["Amazon", "Microsoft"],
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    templates: { javascript: `class MinStack {\n  constructor() {}\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(1), Space: O(N)", explanation: "Maintain a primary stack alongside a min-stack that stores the current minimum at each level." } }
  },
  {
    id: 31,
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    category: "Stack",
    companyTags: ["Google", "LinkedIn"],
    description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, and `/`.",
    templates: { javascript: `function evalRPN(tokens) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Push numbers onto stack. Pop two operands and compute when encountering an operator, then push the result back." } }
  },
  {
    id: 32,
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "Stack",
    companyTags: ["Microsoft", "Meta"],
    description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: [{ input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" }],
    templates: { javascript: `function generateParenthesis(n) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [3], expected: ["((()))","(()())","(())()","()(())","()()()"], inputStr: "3" }],
    explanation: {
      optimal: {
        code: `function generateParenthesis(n) {\n    const res = [];\n    function backtrack(s, open, close) {\n        if (s.length === n * 2) {\n            res.push(s);\n            return;\n        }\n        if (open < n) backtrack(s + '(', open + 1, close);\n        if (close < open) backtrack(s + ')', open, close + 1);\n    }\n    backtrack('', 0, 0);\n    return res;\n}`,
        complexity: "Time: O(4^N / sqrt(N)), Space: O(N) recursion stack",
        explanation: "Backtrack. Append '(' if open count < n, and append ')' if closed count < open count."
      }
    }
  },
  {
    id: 33,
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Stack",
    companyTags: ["Google", "Amazon"],
    description: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature.",
    templates: { javascript: `function dailyTemperatures(temperatures) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Use a monotonic decreasing stack to store index values. Pop indices and calculate day difference once a warmer temperature is encountered." } }
  },
  {
    id: 34,
    title: "Car Fleet",
    difficulty: "Medium",
    category: "Stack",
    companyTags: ["Google"],
    description: "There are `n` cars at given positions moving toward a target destination at constant speeds. Find out how many car fleets will arrive.",
    templates: { javascript: `function carFleet(target, position, speed) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N log N), Space: O(N)", explanation: "Sort cars by starting position descending. Calculate arrival times. If a car's time is <= the car in front, they merge into a fleet." } }
  },
  {
    id: 35,
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Stack",
    companyTags: ["Google", "Amazon"],
    description: "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    templates: { javascript: `function largestRectangleArea(heights) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Use a monotonic stack to store indices. Pop heights when a shorter bar is encountered to calculate area of rectangle with the popped height as shortest height." } }
  },
  {
    id: 36,
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    category: "Stack",
    companyTags: ["Microsoft"],
    description: "Implement a first-in first-out (FIFO) queue using only two stacks. The implemented queue should support push, peek, pop, and empty.",
    templates: { javascript: `class MyQueue {\n  constructor() {}\n  push(x) {}\n  pop() {}\n  peek() {}\n  empty() {}\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Push: O(1), Pop: O(1) amortized, Space: O(N)", explanation: "Push elements to `inStack`. Shift elements to `outStack` during pops/peeks if `outStack` is empty." } }
  },
  {
    id: 37,
    title: "Decode String",
    difficulty: "Medium",
    category: "Stack",
    companyTags: ["Google"],
    description: "Given an encoded string, return its decoded string. The encoding rule is: `k[encoded_string]`, where the `encoded_string` inside square brackets is repeated `k` times.",
    templates: { javascript: `function decodeString(s) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Use a stack to store repeat counts and accumulated strings. Pop and process when closed bracket is encountered." } }
  },
  {
    id: 38,
    title: "Next Greater Element I",
    difficulty: "Easy",
    category: "Stack",
    companyTags: ["Microsoft"],
    description: "The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array.",
    templates: { javascript: `function nextGreaterElement(nums1, nums2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Process nums2 with a monotonic decreasing stack to build a map of next greater elements. Loop through nums1 to read outputs." } }
  },

  // ==================== LINKED LIST ====================
  {
    id: 39,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    companyTags: ["Google", "Microsoft", "Apple"],
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
    templates: {
      javascript: `// Definition for singly-linked list:\n// function ListNode(val, next) { this.val = val; this.next = next; }\nfunction reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`
    },
    testCases: [], // Linked list objects simulated
    explanation: {
      optimal: {
        code: `function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
        complexity: "Time: O(N), Space: O(1)",
        explanation: "Iteratively update current node's pointer to point to its predecessor, shifting pointers forward."
      }
    }
  },
  {
    id: 40,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    companyTags: ["Amazon", "Meta"],
    description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list.",
    templates: { javascript: `function mergeTwoLists(list1, list2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N+M), Space: O(1)", explanation: "Use a dummy head. Traverse lists, appending the smaller node to the merged list. Append remainder at end." } }
  },
  {
    id: 41,
    title: "Reorder List",
    difficulty: "Medium",
    category: "Linked List",
    companyTags: ["Amazon", "Google"],
    description: "You are given the head of a singly linked-list. Reorder the list to match: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2...",
    templates: { javascript: `function reorderList(head) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Find list middle using slow/fast pointers. Reverse second half, then interleave both halves." } }
  },
  {
    id: 42,
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    category: "Linked List",
    companyTags: ["Google", "Meta"],
    description: "Given the `head` of a linked list, remove the `nth` node from the end of the list and return its head.",
    templates: { javascript: `function removeNthFromEnd(head, n) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Create pointer gaps of size N using fast and slow pointers. Shift both until fast reaches tail, slow points just before target." } }
  },
  {
    id: 43,
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    category: "Linked List",
    companyTags: ["Microsoft", "Amazon"],
    description: "Construct a deep copy of a list where each node contains an additional random pointer pointing to any node or null.",
    templates: { javascript: `function copyRandomList(head) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Create copy nodes adjacent to original nodes inside list. Assign random links, then sever the interleaved chain." } }
  },
  {
    id: 44,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    companyTags: ["Amazon", "Microsoft", "Google"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.",
    templates: { javascript: `function addTwoNumbers(l1, l2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(max(N, M)), Space: O(1)", explanation: "Sum node values digit-by-digit while tracking carry-over values. Build output linked list." } }
  },
  {
    id: 45,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    companyTags: ["Microsoft", "Amazon"],
    description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.",
    templates: { javascript: `function hasCycle(head) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Floyd's Cycle-Finding Algorithm. Fast runner moves 2 steps, slow runner moves 1 step. Collision proves cycle exists." } }
  },
  {
    id: 46,
    title: "Linked List Cycle II",
    difficulty: "Medium",
    category: "Linked List",
    companyTags: ["Microsoft", "Amazon"],
    description: "Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.",
    templates: { javascript: `function detectCycle(head) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "After detecting cycle with fast/slow pointers, reset slow to head. Advance both 1 step at a time; intersection is cycle origin." } }
  },
  {
    id: 47,
    title: "LRU Cache",
    difficulty: "Medium",
    category: "Linked List",
    companyTags: ["Amazon", "Microsoft", "Google"],
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    templates: { javascript: `class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Get: O(1), Put: O(1), Space: O(Capacity)", explanation: "Combine a hash map for O(1) key lookups with a doubly linked list to track usage priority in constant time." } }
  },
  {
    id: 48,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List",
    companyTags: ["Google", "Amazon", "Meta"],
    description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all list nodes.",
    templates: { javascript: `function mergeKLists(lists) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N log K), Space: O(log K) divide-and-conquer", explanation: "Use divide-and-conquer to merge pairs of lists iteratively, decreasing lists quantity from K to 1." } }
  },

  // ==================== BINARY SEARCH ====================
  {
    id: 49,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    companyTags: ["Google", "Microsoft"],
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
    templates: { javascript: `function search(nums, target) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, inputStr: "[-1,0,3,5,9,12], 9" },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, inputStr: "[-1,0,3,5,9,12], 2" }
    ],
    explanation: {
      optimal: {
        code: `function search(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        let m = Math.floor((l + r) / 2);\n        if (nums[m] === target) return m;\n        else if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}`,
        complexity: "Time: O(log N), Space: O(1)",
        explanation: "Halve searching range dynamically by comparing target to the middle element."
      }
    }
  },
  {
    id: 50,
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    companyTags: ["Microsoft", "Amazon"],
    description: "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`.",
    templates: { javascript: `function searchMatrix(matrix, target) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(log(M * N)), Space: O(1)", explanation: "Flatten matrix conceptually: index index as `r = Math.floor(i / N)`, `c = i % N`. Execute standard binary search." } }
  },
  {
    id: 51,
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    category: "Binary Search",
    companyTags: ["Google"],
    description: "Koko loves to eat bananas. Return the minimum integer eating speed `k` such that she can eat all bananas within `h` hours.",
    templates: { javascript: `function minEatingSpeed(piles, h) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N log(MaxPile)), Space: O(1)", explanation: "Binary search on rate speed. Check if speed `m` completes task in time. Shift left for success, right for fail." } }
  },
  {
    id: 52,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    companyTags: ["Google", "Microsoft"],
    description: "Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times. Find the minimum element.",
    templates: { javascript: `function findMin(nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(log N), Space: O(1)", explanation: "Compare mid value to right value. If nums[mid] > nums[right], minimum lies in right half. Otherwise, minimum is mid or left." } }
  },
  {
    id: 53,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    companyTags: ["Google", "Amazon"],
    description: "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`.",
    templates: { javascript: `function searchRotated(nums, target) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(log N), Space: O(1)", explanation: "Identify which half of array (left/right) is sorted. Check if target lies within that sorted range to divide search space." } }
  },
  {
    id: 54,
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    category: "Binary Search",
    companyTags: ["Google", "Netflix"],
    description: "Design a time-based key-value data store that can store multiple values for the same key at different timestamps.",
    templates: { javascript: `class TimeMap {\n  constructor() {}\n  set(key, value, timestamp) {}\n  get(key, timestamp) {}\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Get: O(log N), Set: O(1), Space: O(N)", explanation: "Map keys to arrays of [timestamp, value] pairs. Perform binary search on timestamps to fetch active records." } }
  },
  {
    id: 55,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    companyTags: ["Google", "Apple"],
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
    templates: { javascript: `function findMedianSortedArrays(nums1, nums2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(log(min(M, N))), Space: O(1)", explanation: "Partition the smaller array using binary search. Ensure left elements on both arrays partition correctly to separate array halves." } }
  },
  {
    id: 56,
    title: "First Bad Version",
    difficulty: "Easy",
    category: "Binary Search",
    companyTags: ["Meta"],
    description: "You are a product manager and currently leading a team to develop a new product. Find the first bad version.",
    templates: { javascript: `function solution(isBadVersion) {\n  return function(n) {\n    \n  };\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(log N), Space: O(1)", explanation: "Binary search on versions. Check midpoint version. Shrink right boundary to mid if bad, advance left to mid + 1 if good." } }
  },

  // ==================== TREES ====================
  {
    id: 57,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Google"],
    description: "Given the `root` of a binary tree, invert the tree, and return its root.",
    examples: [{ input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
    templates: {
      javascript: `// Definition for a binary tree node:\n// function TreeNode(val, left, right) { this.val = val; this.left = left; this.right = right; }\nfunction invertTree(root) {\n    if (!root) return null;\n    let temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`
    },
    testCases: [],
    explanation: {
      optimal: {
        code: `function invertTree(root) {\n    if (!root) return null;\n    const temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`,
        complexity: "Time: O(N), Space: O(H) recursion height stack",
        explanation: "Recursively swap left and right pointers of every node in tree."
      }
    }
  },
  {
    id: 58,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Amazon"],
    description: "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path.",
    templates: { javascript: `function maxDepth(root) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(H)", explanation: "Recursively return: 1 + Math.max(maxDepth(root.left), maxDepth(root.right))." } }
  },
  {
    id: 59,
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Google"],
    description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path.",
    templates: { javascript: `function diameterOfBinaryTree(root) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(H)", explanation: "Compute depth. On each node, update a global diameter variable using leftDepth + rightDepth." } }
  },
  {
    id: 60,
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Microsoft"],
    description: "Given a binary tree, determine if it is height-balanced.",
    templates: { javascript: `function isBalanced(root) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(H)", explanation: "DFS check. Return -1 if subtrees are unbalanced or depth difference > 1. Otherwise return correct depth." } }
  },
  {
    id: 61,
    title: "Same Tree",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Amazon"],
    description: "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.",
    templates: { javascript: `function isSameTree(p, q) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(H)", explanation: "DFS base cases. If both nodes are null return true; if one is null or values mismatch return false. Recursively check children." } }
  },
  {
    id: 62,
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Google"],
    description: "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` which has the same structure.",
    templates: { javascript: `function isSubtree(root, subRoot) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(S * T), Space: O(H)", explanation: "Check if sameTree(root, subRoot) is true. If not, traverse children recursively checking isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)." } }
  },
  {
    id: 63,
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Easy",
    category: "Trees",
    companyTags: ["Meta", "Amazon"],
    description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
    templates: { javascript: `function lowestCommonAncestor(root, p, q) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(H), Space: O(1)", explanation: "BST properties. If both nodes are smaller than root, move left. If both are larger, move right. Otherwise, current root is LCA." } }
  },
  {
    id: 64,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    companyTags: ["Amazon", "Microsoft"],
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    templates: { javascript: `function levelOrder(root) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "BFS using a queue. Loop level size times to collect nodes at each horizontal level." } }
  },
  {
    id: 65,
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    category: "Trees",
    companyTags: ["Meta", "Google"],
    description: "Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see.",
    templates: { javascript: `function rightSideView(root) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(H)", explanation: "Modified DFS (Root -> Right -> Left). Append node value to output array if current depth matches output length." } }
  },
  {
    id: 66,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    companyTags: ["Amazon", "Microsoft"],
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    templates: { javascript: `function isValidBST(root) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(H)", explanation: "Pass bounding intervals (min, max) down recursively. Check that root.val is strictly inside boundaries." } }
  },
  {
    id: 67,
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    category: "Trees",
    companyTags: ["Google", "Amazon"],
    description: "Given the root of a binary search tree, and an integer `k`, return the `k`-th smallest value (1-indexed) of all the values of the nodes.",
    templates: { javascript: `function kthSmallest(root, k) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N) worst case, Space: O(H)", explanation: "In-order traversal (Left -> Root -> Right) yields sorted array keys. Traverse until the K-th element is encountered." } }
  },
  {
    id: 68,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    companyTags: ["Google", "Meta"],
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    templates: { javascript: `function serialize(root) {}\nfunction deserialize(data) {}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(N)", explanation: "Use pre-order traversal. Serialize null nodes as '#'. Deserialize using a recursive queue shifter." } }
  },

  // ==================== HEAP / PRIORITY QUEUE ====================
  {
    id: 69,
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    category: "Heap",
    companyTags: ["Google"],
    description: "Design a class to find the `k`-th largest element in a stream.",
    templates: { javascript: `class KthLargest {\n  constructor(k, nums) {}\n  add(val) {}\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Constructor: O(N log K), Add: O(log K), Space: O(K)", explanation: "Maintain a min-heap of size K. If heap size exceeds K, pop the smallest element. The top of the heap is the answer." } }
  },
  {
    id: 70,
    title: "Last Stone Weight",
    difficulty: "Easy",
    category: "Heap",
    companyTags: ["Amazon"],
    description: "You are given an array of integers `stones`. Smash the two heaviest stones. Return the weight of the last stone.",
    templates: { javascript: `function lastStoneWeight(stones) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N log N), Space: O(N)", explanation: "Add stones to a Max-Heap. Pop the top two values, smash them, and push the remaining weight back if > 0." } }
  },
  {
    id: 71,
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    category: "Heap",
    companyTags: ["Amazon", "Google"],
    description: "Given an array of `points` where `points[i] = [xi, yi]` and an integer `k`, return the `k` closest points to the origin.",
    templates: { javascript: `function kClosest(points, k) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N log K), Space: O(K)", explanation: "Maintain a Max-Heap of size K based on Euclidean distance. Pop points when heap size exceeds K." } }
  },
  {
    id: 72,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Heap",
    companyTags: ["Meta", "Amazon"],
    description: "Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array.",
    templates: { javascript: `function findKthLargest(nums, k) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N) average, Space: O(1)", explanation: "Quickselect algorithm based on QuickSort partitioning. Or use a Min-Heap of size K, yielding O(N log K) time." } }
  },
  {
    id: 73,
    title: "Task Scheduler",
    difficulty: "Medium",
    category: "Heap",
    companyTags: ["Meta", "Amazon"],
    description: "Given a characters array `tasks` and an integer `n`, return the least number of units of time that the CPU will take to finish all tasks.",
    templates: { javascript: `function leastInterval(tasks, n) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Formulaic: Count maximum frequency of task M. Total cycles = (M - 1) * (n + 1) + (number of tasks with freq M). Compare to tasks.length." } }
  },
  {
    id: 74,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    category: "Heap",
    companyTags: ["Google", "Microsoft"],
    description: "Design a data structure that supports adding numbers from a data stream and finding the median.",
    templates: { javascript: `class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() {}\n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Add: O(log N), Find: O(1), Space: O(N)", explanation: "Maintain two heaps: a max-heap for the smaller half and a min-heap for the larger half. Balance size so they differ by at most 1." } }
  },

  // ==================== BACKTRACKING ====================
  {
    id: 75,
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Meta", "Google"],
    description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    examples: [{ input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }],
    templates: { javascript: `function subsets(nums) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[1, 2]], expected: [[], [1], [2], [1, 2]], inputStr: "[1,2]" }],
    explanation: {
      optimal: {
        code: `function subsets(nums) {\n    const res = [];\n    function backtrack(i, path) {\n        if (i === nums.length) {\n            res.push([...path]);\n            return;\n        }\n        // Decision to include nums[i]\n        path.push(nums[i]);\n        backtrack(i + 1, path);\n        // Decision not to include nums[i]\n        path.pop();\n        backtrack(i + 1, path);\n    }\n    backtrack(0, []);\n    return res;\n}`,
        complexity: "Time: O(N * 2^N), Space: O(N) recursion stack",
        explanation: "For each element, decide recursively whether to include it or exclude it from the current subset path."
      }
    }
  },
  {
    id: 76,
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Google", "Amazon"],
    description: "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations where the chosen numbers sum to target.",
    templates: { javascript: `function combinationSum(candidates, target) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(2^T) where T is target value, Space: O(T)", explanation: "Backtrack. At each step, either include candidate (allow repeat by staying at current index) or skip index." } }
  },
  {
    id: 77,
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Google", "LinkedIn"],
    description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
    examples: [{ input: "nums = [1,2]", output: "[[1,2],[2,1]]" }],
    templates: { javascript: `function permute(nums) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[1, 2]], expected: [[1, 2], [2, 1]], inputStr: "[1,2]" }],
    explanation: {
      optimal: {
        code: `function permute(nums) {\n    const res = [];\n    function backtrack(path, used) {\n        if (path.length === nums.length) {\n            res.push([...path]);\n            return;\n        }\n        for (let i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.push(nums[i]);\n            backtrack(path, used);\n            path.pop();\n            used[i] = false;\n        }\n    }\n    backtrack([], Array(nums.length).fill(false));\n    return res;\n}`,
        complexity: "Time: O(N * N!), Space: O(N)",
        explanation: "Construct paths by looping through elements. Skip already used values in the path, backtracking to clean states."
      }
    }
  },
  {
    id: 78,
    title: "Subsets II",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Amazon"],
    description: "Given an integer array `nums` that may contain duplicates, return all possible subsets. Duplicates must be skipped.",
    templates: { javascript: `function subsetsWithDup(nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N * 2^N), Space: O(N)", explanation: "Sort array. During backtracking, if you choose to skip nums[i], skip all subsequent elements equal to nums[i]." } }
  },
  {
    id: 79,
    title: "Combination Sum II",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Google"],
    description: "Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations where candidates sum to target.",
    templates: { javascript: `function combinationSum2(candidates, target) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(2^N), Space: O(N)", explanation: "Sort array. Skip duplicates during loops at same tree depth. Backtrack forward, incrementing indices." } }
  },
  {
    id: 80,
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Amazon", "Microsoft"],
    description: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
    templates: { javascript: `function exist(board, word) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(M * N * 4^L) where L is word length, Space: O(L)", explanation: "Run DFS on every cell. Check adjacent cells for matches. Temporarily set board cells to visitor markers to prevent cycles." } }
  },
  {
    id: 81,
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    category: "Backtracking",
    companyTags: ["Google"],
    description: "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible partitions.",
    templates: { javascript: `function partition(s) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N * 2^N), Space: O(N)", explanation: "Backtrack. Check if prefix substring is palindrome. If yes, add to path and recurse on remainder string." } }
  },
  {
    id: 82,
    title: "N-Queens",
    difficulty: "Hard",
    category: "Backtracking",
    companyTags: ["Google", "Meta"],
    description: "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.",
    templates: { javascript: `function solveNQueens(n) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N!), Space: O(N^2)", explanation: "Place queens row-by-row. Maintain sets tracking cols, positive diagonals (r + c), and negative diagonals (r - c) to prune configurations." } }
  },

  // ==================== GRAPHS ====================
  {
    id: 83,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Amazon", "Google", "Microsoft"],
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.",
    examples: [
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3"
      }
    ],
    templates: { javascript: `function numIslands(grid) {\n    // Write your code here\n    \n}` },
    testCases: [
      {
        input: [[
          ["1","1","1","1","0"],
          ["1","1","0","1","0"],
          ["1","1","0","0","0"],
          ["0","0","0","0","0"]
        ]],
        expected: 1,
        inputStr: "[1 island grid]"
      },
      {
        input: [[
          ["1","1","0","0","0"],
          ["1","1","0","0","0"],
          ["0","0","1","0","0"],
          ["0","0","0","1","1"]
        ]],
        expected: 3,
        inputStr: "[3 islands grid]"
      }
    ],
    explanation: {
      optimal: {
        code: `function numIslands(grid) {\n    if (!grid || grid.length === 0) return 0;\n    let count = 0;\n    function dfs(r, c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;\n        grid[r][c] = '0'; // Sink island element\n        dfs(r + 1, c);\n        dfs(r - 1, c);\n        dfs(r, c + 1);\n        dfs(r, c - 1);\n    }\n    for (let r = 0; r < grid.length; r++) {\n        for (let c = 0; c < grid[0].length; c++) {\n            if (grid[r][c] === '1') {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    return count;\n}`,
        complexity: "Time: O(R * C), Space: O(R * C) recursion depth stack",
        explanation: "Loop through grid. When land ('1') is encountered, increment count and run DFS/BFS to sink (overwrite to '0') all connected land nodes."
      }
    }
  },
  {
    id: 84,
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Meta", "Google"],
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    templates: { javascript: `function cloneGraph(node) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(V + E), Space: O(V)", explanation: "Use a map storing originalNode -> clonedNode. Run DFS/BFS recursively cloning links." } }
  },
  {
    id: 85,
    title: "Max Area of Island",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Google", "Amazon"],
    description: "Given an `m x n` binary matrix `grid`. An island is a group of `1`'s connected 4-directionally. Return the maximum area.",
    templates: { javascript: `function maxAreaOfIsland(grid) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(R * C), Space: O(R * C)", explanation: "DFS traversal tracking island size. When land is found, run DFS, sink land elements, accumulate area size, and update max." } }
  },
  {
    id: 86,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Google"],
    description: "Find the list of grid coordinates where rain water can flow to both the Pacific Ocean and Atlantic Ocean.",
    templates: { javascript: `function pacificAtlantic(heights) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(R * C), Space: O(R * C)", explanation: "DFS from borders inwards. Start from Pacific edges and Atlantic edges. Find nodes reachable from both sets." } }
  },
  {
    id: 87,
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Google", "Amazon"],
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. Return `true` if you can finish all courses.",
    examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }],
    templates: { javascript: `function canFinish(numCourses, prerequisites) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: [2, [[1, 0]]], expected: true, inputStr: "2, [[1,0]]" },
      { input: [2, [[1, 0], [0, 1]]], expected: false, inputStr: "2, [[1,0],[0,1]]" }
    ],
    explanation: {
      optimal: {
        code: `function canFinish(numCourses, prerequisites) {\n    const adj = Array.from({ length: numCourses }, () => []);\n    for (let [course, pre] of prerequisites) {\n        adj[pre].push(course);\n    }\n    const visit = Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited\n    function dfs(course) {\n        if (visit[course] === 1) return false; // Cycle found\n        if (visit[course] === 2) return true;\n        visit[course] = 1;\n        for (let next of adj[course]) {\n            if (!dfs(next)) return false;\n        }\n        visit[course] = 2;\n        return true;\n    }\n    for (let i = 0; i < numCourses; i++) {\n        if (!dfs(i)) return false;\n    }\n    return true;\n}`,
        complexity: "Time: O(V + E), Space: O(V + E)",
        explanation: "Detect cycles in directed graph using DFS coloring. A cycle represents mutual deadlock prerequisites, making completing courses impossible."
      }
    }
  },
  {
    id: 88,
    title: "Course Schedule II",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Google", "Amazon"],
    description: "Return the ordering of courses you should take to finish all courses. If it is impossible, return an empty array.",
    templates: { javascript: `function findOrder(numCourses, prerequisites) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(V + E), Space: O(V + E)", explanation: "Use Kahn's topological sort (BFS in-degrees count) or DFS topological sort to construct dependency ordering, returning empty array if cycle detected." } }
  },
  {
    id: 89,
    title: "Graph Valid Tree",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Google", "Meta"],
    description: "Given `n` nodes labeled from `0` to `n - 1` and a list of undirected edges, write a function to check whether these edges make up a valid tree.",
    templates: { javascript: `function validTree(n, edges) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(V + E), Space: O(V + E)", explanation: "A valid tree must have exactly `n - 1` edges and be fully connected. Validate connectivity with BFS/DFS starting at 0." } }
  },
  {
    id: 90,
    title: "Redundant Connection",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Google"],
    description: "Find an edge that can be removed so that the resulting graph is a tree of `n` nodes.",
    templates: { javascript: `function findRedundantConnection(edges) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N * alpha(N)), Space: O(N)", explanation: "Use Union-Find (Disjoint Sets). Traverse edges, unioning endpoints. If endpoints already share parent, this edge creates a cycle and is redundant." } }
  },
  {
    id: 91,
    title: "Number of Connected Components",
    difficulty: "Medium",
    category: "Graphs",
    companyTags: ["Amazon"],
    description: "Given `n` nodes and a list of undirected edges, return the number of connected components in the graph.",
    templates: { javascript: `function countComponents(n, edges) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(V + E * alpha(V)), Space: O(V)", explanation: "Union-Find structure initialized with component count `n`. Decrement count for every successful union operation." } }
  },
  {
    id: 92,
    title: "Word Ladder",
    difficulty: "Hard",
    category: "Graphs",
    companyTags: ["Amazon", "Google"],
    description: "Given two words (`beginWord` and `endWord`) and a dictionary word list, return the number of words in the shortest transformation sequence.",
    templates: { javascript: `function ladderLength(beginWord, endWord, wordList) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(M^2 * N) where M is word size and N count, Space: O(M^2 * N)", explanation: "BFS queue search. Map generic patterns (e.g. `d*g`) to words for rapid adjacent lookup." } }
  },

  // ==================== DYNAMIC PROGRAMMING ====================
  {
    id: 93,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    companyTags: ["Google", "Apple", "Amazon"],
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [{ input: "n = 3", output: "3", explanation: "There are three ways: 1+1+1, 1+2, 2+1." }],
    templates: { javascript: `function climbStairs(n) {\n    // Write your code here\n    \n}` },
    testCases: [
      { input: [2], expected: 2, inputStr: "2" },
      { input: [3], expected: 3, inputStr: "3" },
      { input: [5], expected: 8, inputStr: "5" }
    ],
    explanation: {
      bruteForce: {
        code: `function climbStairs(n) {\n    if (n <= 2) return n;\n    return climbStairs(n - 1) + climbStairs(n - 2);\n}`,
        complexity: "Time: O(2^N), Space: O(N)",
        explanation: "Simple recursion following Fibonacci sequence. Highly redundant calculations."
      },
      optimal: {
        code: `function climbStairs(n) {\n    if (n <= 2) return n;\n    let one = 1, two = 2;\n    for (let i = 3; i <= n; i++) {\n        let temp = one + two;\n        one = two;\n        two = temp;\n    }\n    return two;\n}`,
        complexity: "Time: O(N), Space: O(1)",
        explanation: "Track previous two step counts and compute upward. Equal to Fibonacci space optimization."
      }
    }
  },
  {
    id: 94,
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    companyTags: ["Amazon"],
    description: "You are given an integer array `cost` where `cost[i]` is the cost of `i`-th step on a staircase. Return the minimum cost to reach the top.",
    templates: { javascript: `function minCostClimbingStairs(cost) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Compute backward. cost[i] += Math.min(cost[i+1], cost[i+2]). Returns min(cost[0], cost[1])." } }
  },
  {
    id: 95,
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companyTags: ["Google", "Microsoft"],
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Return max cash.",
    examples: [{ input: "nums = [1,2,3,1]", output: "4" }],
    templates: { javascript: `function rob(nums) {\n    // Write your code here\n    \n}` },
    testCases: [{ input: [[1, 2, 3, 1]], expected: 4, inputStr: "[1,2,3,1]" }],
    explanation: {
      optimal: {
        code: `function rob(nums) {\n    let rob1 = 0, rob2 = 0;\n    for (let num of nums) {\n        let temp = Math.max(rob1 + num, rob2);\n        rob1 = rob2;\n        rob2 = temp;\n    }\n    return rob2;\n}`,
        complexity: "Time: O(N), Space: O(1)",
        explanation: "Maintain two variables tracking max robbery totals: including current house (rob1 + current) vs skipping current house (rob2)."
      }
    }
  },
  {
    id: 96,
    title: "House Robber II",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companyTags: ["Microsoft"],
    description: "Similar to House Robber, but houses are arranged in a circle. The first and last houses are adjacent.",
    templates: { javascript: `function robCircular(nums) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Return max(rob(nums[0..n-2]), rob(nums[1..n-1])). Solves adjacency of first and last elements." } }
  },
  {
    id: 97,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companyTags: ["Amazon", "Microsoft"],
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    templates: { javascript: `function longestPalindrome(s) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N^2), Space: O(1)", explanation: "Expand from centers. Loop through string, treating each character (and gaps) as centers for palindromes." } }
  },
  {
    id: 98,
    title: "Decode Ways",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companyTags: ["Google", "Meta"],
    description: "A message containing letters from A-Z can be encoded to numbers. Return the number of ways to decode it.",
    templates: { javascript: `function numDecodings(s) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N), Space: O(1)", explanation: "Iterate from end. dp[i] = dp[i+1] if valid single-digit, + dp[i+2] if valid double-digit (10-26)." } }
  },
  {
    id: 99,
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companyTags: ["Amazon", "Google"],
    description: "Given an integer array `coins` and an integer `amount`, return the fewest number of coins that you need to make up that amount.",
    templates: { javascript: `function coinChange(coins, amount) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(N * A) where A is amount, Space: O(A)", explanation: "Bottom-up DP. dp[i] = min(dp[i], 1 + dp[i - coin]) for all coin values." } }
  },
  {
    id: 100,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companyTags: ["Google", "Amazon"],
    description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence.",
    templates: { javascript: `function longestCommonSubsequence(text1, text2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(M * N), Space: O(M * N)", explanation: "Create 2D DP matrix. If text1[i] == text2[j], cell value = 1 + dp[i+1][j+1]. Else, cell value = max(dp[i+1][j], dp[i][j+1])." } }
  },
  {
    id: 101,
    title: "Edit Distance",
    difficulty: "Hard",
    category: "Dynamic Programming",
    companyTags: ["Google", "Amazon"],
    description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.",
    templates: { javascript: `function minDistance(word1, word2) {\n    \n}` },
    testCases: [],
    explanation: { optimal: { complexity: "Time: O(M * N), Space: O(M * N)", explanation: "Levenshtein distance DP. If word1[i] == word2[j], diagonal cost matches. Else, cell value = 1 + min(insert, delete, replace)." } }
  }
];
